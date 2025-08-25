import type { Room } from "../rooms/room";
import type {
  ILocation,
  IRaceData,
  IRaceCheckpoint,
  IRaceParticipant,
} from "../types/types";

/**
 * Clase dedicada a manejar toda la lógica de carreras
 * Separada del LocationLogicHandler para mejor organización
 */
export class RaceManager {
  /**
   * Activar una carrera en una ubicación
   * Simple: Toma TODOS los jugadores actuales en la ubicación
   */
  static activateRace(location: ILocation, room: Room): boolean {
    // Validaciones básicas - checkpoints están en specificData
    const raceCheckpoints = location.specificData?.raceCheckpoints;
    if (!raceCheckpoints || raceCheckpoints.length === 0) {
      console.warn(`Racing track ${location.id} has no checkpoints configured`);
      return false;
    }

    // Validación básica de checkpoints
    if (raceCheckpoints.length < 2) {
      console.error(`Racing track ${location.id} needs at least 2 checkpoints`);
      return false;
    }

    // Crear carrera con TODOS los jugadores presentes en la ubicación
    const checkpoints = this.loadRaceCheckpoints(raceCheckpoints);
    const participants = new Map<string, IRaceParticipant>();

    // Todos los jugadores en la ubicación participan automáticamente
    Array.from(location.currentPlayers).forEach((playerId) => {
      participants.set(playerId, {
        playerId,
        vehicleId: this.getPlayerVehicle(playerId, room),
        currentCheckpoint: 0,
        checkpointTimes: [],
        totalTime: 0,
        position: 0,
        isFinished: false,
        startTime: 0,
      });
    });

    const raceData: IRaceData = {
      locationId: location.id,
      participants,
      checkpoints,
      totalCheckpoints: checkpoints.length,
      status: "countdown",
      countDown: 10,
      startTime: 0,
      maxDuration: 60000,
      leaderboard: [],
    };

    location.specificData = { ...location.specificData, race: raceData };
    this.startRaceCountdown(location, room);

    console.log(
      `Race started with ${participants.size} players in ${location.id}`
    );
    return true;
  }

  /**
   * Desactivar una carrera
   */
  static deactivateRace(location: ILocation, room: Room): void {
    if (location.specificData?.race) {
      this.broadcastToLocationPlayers(location, room, {
        type: "race:cancelled",
        locationId: location.id,
      });

      delete location.specificData.race;
    }
  }

  /**
   * Cargar checkpoints desde la configuración de la ubicación
   */
  private static loadRaceCheckpoints(
    checkpointData: Array<{
      id: number;
      position: { x: number; y: number; z: number };
      radius: number;
      order: number;
    }>
  ): IRaceCheckpoint[] {
    // Convertir los datos de checkpoints de la ubicación al formato IRaceCheckpoint
    return checkpointData
      .sort((a, b) => a.order - b.order) // Asegurar orden correcto
      .map((checkpoint) => ({
        id: checkpoint.id,
        position: checkpoint.position,
        radius: checkpoint.radius,
        order: checkpoint.order,
      }));
  }

  /**
   * Obtener el vehículo de un jugador
   */
  private static getPlayerVehicle(
    playerId: string,
    room: Room
  ): string | undefined {
    // Find vehicle driven by this player
    for (const [vehicleId, vehicle] of Object.entries(room.vehicles)) {
      if (vehicle.driverId === playerId) {
        return vehicleId;
      }
    }
    return undefined;
  }

  /**
   * Enviar mensaje solo a los jugadores en la ubicación de la carrera
   */
  private static broadcastToLocationPlayers(
    location: ILocation,
    room: Room,
    message: any
  ): void {
    const messageStr = JSON.stringify(message);

    // Enviar a todos los jugadores en la ubicación (participantes y espectadores)
    location.currentPlayers.forEach((playerId) => {
      const playerSocket = room.playerSockets[playerId];

      if (playerSocket && playerSocket.send) {
        try {
          playerSocket.send(messageStr);
        } catch (error) {
          console.warn(
            `Failed to send race message to player ${playerId}:`,
            error
          );
        }
      }
    });
  }

  /**
   * Iniciar cuenta regresiva de la carrera
   */
  private static startRaceCountdown(location: ILocation, room: Room): void {
    const raceData = location.specificData?.race as IRaceData;
    if (!raceData) return;

    let countdown = raceData.countDown;

    console.log("CountDown: ", countdown);

    const countdownInterval = setInterval(() => {
      countdown--;

      this.broadcastToLocationPlayers(location, room, {
        type: "race:countdown",
        locationId: location.id,
        countdown,
        checkpoints: raceData.checkpoints,
      });

      if (countdown <= 0) {
        clearInterval(countdownInterval);
        this.startRace(location, room);
      }
    }, 1000);
  }

  /**
   * Iniciar la carrera
   */
  private static startRace(location: ILocation, room: Room): void {
    const raceData = location.specificData?.race as IRaceData;
    if (!raceData) return;

    raceData.status = "racing";
    raceData.startTime = Date.now();

    // Initialize participant start times
    raceData.participants.forEach((participant) => {
      participant.startTime = raceData.startTime;
    });

    this.broadcastToLocationPlayers(location, room, {
      type: "race:start",
      locationId: location.id,
      startTime: raceData.startTime,
      checkpoints: raceData.checkpoints,
      participants: Array.from(raceData.participants.keys()),
    });

    // Set race timeout
    setTimeout(() => {
      this.endRace(location, room, "timeout");
      console.log("Race ended due to timeout");
    }, raceData.maxDuration);
  }

  /**
   * Manejar el cruce de un checkpoint
   */
  static handleCheckpointCrossing(
    location: ILocation,
    room: Room,
    playerId: string,
    checkpointId: number
  ): void {
    const raceData = location.specificData?.race as IRaceData;
    if (!raceData || raceData.status !== "racing") return;

    console.log("RACE DATA ALV", raceData);

    const participant = raceData.participants.get(playerId);
    if (!participant || participant.isFinished) return;

    // Check if this is the next expected checkpoint
    if (checkpointId === participant.currentCheckpoint) {
      const currentTime = Date.now();
      const checkpointTime = currentTime - raceData.startTime;

      participant.checkpointTimes.push(checkpointTime);
      participant.currentCheckpoint++;

      // Check if race is finished
      if (participant.currentCheckpoint >= raceData.totalCheckpoints) {
        participant.isFinished = true;
        participant.totalTime = checkpointTime;

        // Update leaderboard
        this.updateLeaderboard(raceData);

        // Check if this is the winner
        if (raceData.leaderboard.length === 1) {
          this.endRace(location, room, "completed");
          return;
        }
      }

      // Update positions and broadcast
      this.updateRacePositions(raceData);
      this.broadcastRaceUpdate(location, room, raceData);
    }
  }

  /**
   * Actualizar el leaderboard
   */
  private static updateLeaderboard(raceData: IRaceData): void {
    const finishedParticipants = Array.from(raceData.participants.values())
      .filter((p) => p.isFinished)
      .sort((a, b) => a.totalTime - b.totalTime);

    raceData.leaderboard = finishedParticipants.map((p) => p.playerId);

    console.log(raceData.leaderboard);
  }

  /**
   * Actualizar las posiciones de los participantes
   */
  private static updateRacePositions(raceData: IRaceData): void {
    const participants = Array.from(raceData.participants.values()).sort(
      (a, b) => {
        if (a.isFinished && !b.isFinished) return -1;
        if (!a.isFinished && b.isFinished) return 1;
        if (a.isFinished && b.isFinished) return a.totalTime - b.totalTime;

        // Both racing - compare by checkpoint progress
        if (a.currentCheckpoint !== b.currentCheckpoint) {
          return b.currentCheckpoint - a.currentCheckpoint;
        }

        // Same checkpoint - compare by time to reach current checkpoint
        const aTime = a.checkpointTimes[a.currentCheckpoint - 1] || 0;
        const bTime = b.checkpointTimes[b.currentCheckpoint - 1] || 0;
        return aTime - bTime;
      }
    );

    participants.forEach((participant, index) => {
      participant.position = index + 1;
    });
  }

  /**
   * Enviar actualización de la carrera a todos los clientes
   */
  private static broadcastRaceUpdate(
    location: ILocation,
    room: Room,
    raceData: IRaceData
  ): void {
    const raceUpdate = {
      type: "race:update",
      locationId: location.id,
      leaderboard: Array.from(raceData.participants.values())
        .sort((a, b) => a.position - b.position)
        .slice(0, 5) // Top 5
        .map((p) => ({
          playerId: p.playerId,
          position: p.position,
          currentCheckpoint: p.currentCheckpoint,
          totalCheckpoints: raceData.totalCheckpoints,
          isFinished: p.isFinished,
          totalTime: p.totalTime,
        })),
      status: raceData.status,
    };

    this.broadcastToLocationPlayers(location, room, raceUpdate);
  }

  /**
   * Finalizar la carrera
   */
  private static endRace(
    location: ILocation,
    room: Room,
    reason: "completed" | "timeout"
  ): void {
    const raceData = location.specificData?.race as IRaceData;
    if (!raceData) return;

    raceData.status = "finished";
    this.updateLeaderboard(raceData);

    const raceResults = {
      type: "race:finished",
      locationId: location.id,
      reason,
      winner: raceData.leaderboard[0] || null,
      finalResults: Array.from(raceData.participants.values())
        .sort((a, b) => {
          if (a.isFinished && !b.isFinished) return -1;
          if (!a.isFinished && b.isFinished) return 1;
          if (a.isFinished && b.isFinished) return a.totalTime - b.totalTime;
          return b.currentCheckpoint - a.currentCheckpoint;
        })
        .map((p) => ({
          playerId: p.playerId,
          position: p.position,
          totalTime: p.totalTime,
          checkpointsCompleted: p.currentCheckpoint,
          isFinished: p.isFinished,
        })),
    };

    this.broadcastToLocationPlayers(location, room, raceResults);

    // Clean up race data after 30 seconds
    setTimeout(() => {
      if (location.specificData?.race) {
        delete location.specificData.race;
      }

      console.log(`Race cleaned up in ${location.id}`);
    }, 30000);
  }

  /**
   * Obtener el estado actual de una carrera
   */
  static getRaceStatus(location: ILocation): {
    isActive: boolean;
    status?: string;
    participants?: number;
    leaderboard?: any[];
  } {
    const raceData = location.specificData?.race as IRaceData;

    if (!raceData) {
      return { isActive: false };
    }

    return {
      isActive: true,
      status: raceData.status,
      participants: raceData.participants.size,
      leaderboard: Array.from(raceData.participants.values())
        .sort((a, b) => a.position - b.position)
        .slice(0, 3)
        .map((p) => ({
          playerId: p.playerId,
          position: p.position,
          currentCheckpoint: p.currentCheckpoint,
          isFinished: p.isFinished,
        })),
    };
  }

  /**
   * Forzar el final de una carrera (para administradores)
   */
  static forceEndRace(location: ILocation, room: Room): boolean {
    const raceData = location.specificData?.race as IRaceData;
    if (!raceData) {
      return false;
    }

    this.endRace(location, room, "timeout");
    console.log(`Race forcefully ended in ${location.id}`);
    return true;
  }

  // Métodos simplificados - Los jugadores se manejan automáticamente
  // cuando entran/salen de la ubicación, no necesitamos gestión manual
}
