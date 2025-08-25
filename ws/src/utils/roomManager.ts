import { randomUUIDv7 } from "bun";
import type { IRoom, IPlayer, IVehicle, IGameState } from "../types/types";

export class RoomManager {
  private gameState: IGameState;

  constructor(gameState: IGameState) {
    this.gameState = gameState;
  }

  // Crear una nueva room
  createRoom(name: string, maxPlayers: number = 50): IRoom {
    const roomId = randomUUIDv7();
    const room: IRoom = {
      id: roomId,
      name,
      players: {},
      vehicles: {},
      locations: {}, // Inicializar locaciones vacías
      maxPlayers,
      createdAt: new Date(),
    };

    this.gameState.rooms[roomId] = room;
    return room;
  }

  // Obtener una room por ID
  getRoom(roomId: string): IRoom | null {
    return this.gameState.rooms[roomId] || null;
  }

  // Agregar un player a una room
  addPlayerToRoom(playerId: string, roomId: string): boolean {
    const room = this.getRoom(roomId);
    const player = this.gameState.players[playerId];

    if (!room || !player) return false;
    if (Object.keys(room.players).length >= room.maxPlayers) return false;

    // Remover player de room anterior si existe
    if (player.currentRoom) {
      this.removePlayerFromRoom(playerId, player.currentRoom);
    }

    // Agregar a nueva room
    room.players[playerId] = player;
    player.currentRoom = roomId;
    return true;
  }

  // Remover un player de una room
  removePlayerFromRoom(playerId: string, roomId: string): boolean {
    const room = this.getRoom(roomId);
    if (!room || !room.players[playerId]) return false;

    // Remover de todas las locaciones de la room
    for (const location of Object.values(room.locations)) {
      if (location.players[playerId]) {
        delete location.players[playerId];
      }
    }

    delete room.players[playerId];

    // Si el player existe globalmente, limpiar su room y locación
    if (this.gameState.players[playerId]) {
      this.gameState.players[playerId].currentRoom = "";
      this.gameState.players[playerId].currentLocation = undefined;
    }

    return true;
  }

  // Agregar un vehículo a una room
  addVehicleToRoom(vehicleId: string, roomId: string): boolean {
    const room = this.getRoom(roomId);
    const vehicle = this.gameState.vehicles[vehicleId];

    if (!room || !vehicle) return false;

    // Remover vehículo de room anterior si existe
    if (vehicle.currentRoom) {
      this.removeVehicleFromRoom(vehicleId, vehicle.currentRoom);
    }

    // Agregar a nueva room
    room.vehicles[vehicleId] = vehicle;
    vehicle.currentRoom = roomId;
    return true;
  }

  // Remover un vehículo de una room
  removeVehicleFromRoom(vehicleId: string, roomId: string): boolean {
    const room = this.getRoom(roomId);
    if (!room || !room.vehicles[vehicleId]) return false;

    // Remover de todas las locaciones de la room
    for (const location of Object.values(room.locations)) {
      if (location.vehicles[vehicleId]) {
        delete location.vehicles[vehicleId];
      }
    }

    delete room.vehicles[vehicleId];

    // Si el vehículo existe globalmente, limpiar su room y locación
    if (this.gameState.vehicles[vehicleId]) {
      this.gameState.vehicles[vehicleId].currentRoom = "";
      this.gameState.vehicles[vehicleId].currentLocation = undefined;
    }

    return true;
  }

  // Obtener todos los players de una room
  getRoomPlayers(roomId: string): Record<string, IPlayer> {
    const room = this.getRoom(roomId);
    return room ? room.players : {};
  }

  // Obtener todos los vehículos de una room
  getRoomVehicles(roomId: string): Record<string, IVehicle> {
    const room = this.getRoom(roomId);
    return room ? room.vehicles : {};
  }

  // Obtener el estado completo de una room
  getRoomState(roomId: string) {
    const room = this.getRoom(roomId);
    if (!room) return null;

    return {
      id: room.id,
      name: room.name,
      players: room.players,
      vehicles: room.vehicles,
      locations: Object.values(room.locations).map(loc => ({
        id: loc.id,
        name: loc.name,
        type: loc.type,
        playerCount: Object.keys(loc.players).length,
        vehicleCount: Object.keys(loc.vehicles).length,
        maxPlayers: loc.maxPlayers,
        isActive: loc.isActive,
      })),
      playerCount: Object.keys(room.players).length,
      maxPlayers: room.maxPlayers,
      createdAt: room.createdAt,
    };
  }

  // Listar todas las rooms disponibles
  listRooms() {
    return Object.values(this.gameState.rooms).map((room) => ({
      id: room.id,
      name: room.name,
      playerCount: Object.keys(room.players).length,
      maxPlayers: room.maxPlayers,
      createdAt: room.createdAt,
    }));
  }

  // Eliminar una room vacía
  deleteRoom(roomId: string): boolean {
    const room = this.getRoom(roomId);
    if (!room) return false;

    // Solo eliminar si está vacía (incluyendo locaciones)
    const hasPlayers = Object.keys(room.players).length > 0;
    const hasVehicles = Object.keys(room.vehicles).length > 0;
    const hasActiveLocations = Object.values(room.locations).some(loc => 
      Object.keys(loc.players).length > 0 || Object.keys(loc.vehicles).length > 0
    );

    if (!hasPlayers && !hasVehicles && !hasActiveLocations) {
      delete this.gameState.rooms[roomId];
      return true;
    }

    return false;
  }
}
