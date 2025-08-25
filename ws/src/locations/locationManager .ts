import type { Room } from "../rooms/room";
import { type ILocation, type LocationType } from "../types/types";
import { LocationLogicHandler } from "./LocationLogicHandler";

const { executeLogic } = LocationLogicHandler;

export class LocationManager {
  private room: Room;
  locations: Map<string, ILocation> = new Map();
  private playerLocations: Map<string, string> = new Map();
  private deactivationTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(room: Room) {
    this.room = room;
  }

  movePlayerToLocation(playerId: string, locationId: string): boolean {
    const location = this.locations.get(locationId);

    if (!location || location.currentPlayers.size >= location.capacity)
      return false;

    const currentLocationId = this.playerLocations.get(playerId);

    if (currentLocationId) {
      this.removePlayerFromLocation(playerId, currentLocationId);
    }

    location.currentPlayers.add(playerId);
    this.playerLocations.set(playerId, locationId);
    location.lastActivity = new Date();

    // Asignar posición de spawn al jugador
    const player = this.room.players[playerId];
    if (player && location.spawnPoints.length > 0) {
      const spawnPoint = this.getAvailableSpawnPoint(location);
      player.position = { x: spawnPoint.x, y: spawnPoint.y, z: spawnPoint.z };
    }


    this.checLocationActivation(locationId);

    // this.broadcastLocationUpdate(locationId);

    return true;
  }

  private getAvailableSpawnPoint(location: ILocation): {
    x: number;
    y: number;
    z: number;
  } {
    // Por ahora retornamos el primer spawn point, pero se puede mejorar
    // para seleccionar uno aleatorio o el más alejado de otros jugadores
    return location.spawnPoints[0] || { x: 0, y: 1, z: 0 };
  }

  removePlayerFromLocation(playerId: string, locationId?: string): void {
    const targetLocationId = locationId || this.playerLocations.get(playerId);

    if (!targetLocationId) return;

    const location = this.locations.get(targetLocationId);
    if (location) {
      location.currentPlayers.delete(playerId);
      this.playerLocations.delete(playerId);

      // console.log("HERERERERER", targetLocationId);

      this.checkLocationDeactivation(targetLocationId);
      // this.broadcastLocationUpdate(targetLocationId);
    }
  }

  private checLocationActivation(locationId: string): void {
    const location = this.locations.get(locationId);

    if (!location || location.isActive) return;

    if (location.currentPlayers.size >= location.activationThreshold) {
      this.activateLocation(locationId);
    }
  }

  private checkLocationDeactivation(locationId: string): void {
    const location = this.locations.get(locationId);

    if (!location || !location.isActive) return;

    if (location.currentPlayers.size < location.activationThreshold) {
      const existingTimer = this.deactivationTimers.get(locationId);
      if (existingTimer) clearTimeout(existingTimer);

      const timer = setTimeout(() => {
        if (location.currentPlayers.size < location.activationThreshold) {
          this.deactivateLocation(locationId);
        }
      }, location.deactivationDelay);

      this.deactivationTimers.set(locationId, timer);
    }
  }

  private activateLocation(locationId: string): void {
    const location = this.locations.get(locationId);

    if (!location) return;

    location.isActive = true;

    this.room.activeLocations.add(locationId);

    const timer = this.deactivationTimers.get(locationId);

    console.log(timer);

    if (timer) {
      clearTimeout(timer);
      this.deactivationTimers.delete(locationId);
    }

    // this.executeLocationLogic(locationId, "deactivate");
    executeLogic(location, "activate", this.room);

    // Notificar desactivación
    this.broadcastLocationActivation(locationId);
  }

  private deactivateLocation(locationId: string): void {
    const location = this.locations.get(locationId);
    if (!location) return;

    location.isActive = false;
    this.room.activeLocations.delete(locationId);

    // Ejecutar lógica específica de desactivación
    // this.executeLocationLogic(locationId, "deactivate");

    // console.log("hehrherhehrhehr", location, "deactivate", this.room);

    executeLogic(location, "deactivate", this.room);

    // Notificar desactivación
    this.broadcastLocationDeactivation(locationId);
  }

  private broadcastLocationActivation(locationId: string): void {
    this.room.server?.publish(
      this.room.id,
      JSON.stringify({
        type: "location:activated",
        locationId: locationId,
        timestamp: Date.now(),
      })
    );
  }

  private broadcastLocationDeactivation(locationId: string): void {
    this.room.server?.publish(
      this.room.id,
      JSON.stringify({
        type: "location:deactivated",
        locationId: locationId,
        timestamp: Date.now(),
      })
    );
  }

  private broadcastLocationUpdate(locationId: string): void {
    const location = this.locations.get(locationId);
    if (!location) return;

    this.room.server?.publish(
      this.room.id,
      JSON.stringify({
        type: "location:update",
        locationId: locationId,
        playerCount: location.currentPlayers.size,
        isActive: location.isActive,
        timestamp: Date.now(),
      })
    );
  }

  getLocationState(locationId: string) {
    const location = this.locations.get(locationId);
    if (!location) return null;

    return {
      id: location.id,
      name: location.name,
      type: location.type,
      playerCount: location.currentPlayers.size,
      capacity: location.capacity,
      isActive: location.isActive,
      players: Array.from(location.currentPlayers),
    };
  }

  getAllLocationsState() {
    const locations: any[] = [];
    for (const [locationId] of this.locations) {
      const state = this.getLocationState(locationId);
      if (state) locations.push(state);
    }
    return locations;
  }

  getPlayerLocation(playerId: string): string | undefined {
    return this.playerLocations.get(playerId);
  }
}
