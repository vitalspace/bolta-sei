import { type IGameState, type IPlayer, type IVehicle } from "../types/types";
import { Room } from "../rooms/room";

class GameState implements IGameState {
  players: Record<string, IPlayer> = {};
  vehicles: Record<string, IVehicle> = {};
  rooms: Record<string, Room> = {};

  constructor() {
    // Crear la room principal
    this.rooms.main = new Room({
      id: "main",
      name: "Main Room",
      maxPlayers: 100,
      createdAt: new Date(),
    });

    // console.log(`🏠 Game state initialized with main room`);
  }

  // Method to manually initialize vehicles for a specific room
  initializeRoomVehicles(roomId: string) {
    const room = this.rooms[roomId];
    if (room && room.isPhysicsInitialized) {
      room.initializeVehiclesFromEntities();
      console.log(`🚗 Vehicles initialized for room: ${roomId}`);
    } else {
      console.warn(`⚠️ Room ${roomId} not found or physics not initialized`);
    }
  }

  // Method to get all vehicles from all rooms
  getAllVehicles() {
    const allVehicles: Record<string, IVehicle> = {};

    for (const room of Object.values(this.rooms)) {
      const roomVehicles = room.getAllRoomVehicles();
      Object.assign(allVehicles, roomVehicles);
    }

    return allVehicles;
  }

  // Method to set server for all rooms (for broadcasting)
  setServer(server: any) {
    for (const room of Object.values(this.rooms)) {
      room.setServer(server);
    }
    console.log(`🌐 Server configured for all rooms`);
  }
}

export const gameState = new GameState();
