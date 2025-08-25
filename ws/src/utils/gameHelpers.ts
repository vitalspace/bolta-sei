import { gameState } from "../gameState";
import type { IPlayer, IVehicle } from "../types/types";

// Obtener todos los players de la room main
export const getMainRoomPlayers = (): Record<string, IPlayer> => {
  return gameState.rooms.main?.players || {};
};

// Obtener todos los vehículos de la room main
export const getMainRoomVehicles = (): Record<string, IVehicle> => {
  return gameState.rooms.main?.vehicles || {};
};

// Agregar un vehículo a la room main
export const addVehicleToMain = (vehicle: IVehicle): void => {
  if (!gameState.rooms.main) return;
  
  vehicle.currentRoom = "main";
  gameState.vehicles[vehicle.id] = vehicle;
  gameState.rooms.main.vehicles[vehicle.id] = vehicle;
};

// Remover un vehículo de la room main
export const removeVehicleFromMain = (vehicleId: string): void => {
  if (gameState.rooms.main) {
    delete gameState.rooms.main.vehicles[vehicleId];
  }
  delete gameState.vehicles[vehicleId];
};

// Obtener estadísticas de la room main
export const getMainRoomStats = () => {
  const room = gameState.rooms.main;
  if (!room) {
    return {
      playerCount: 0,
      vehicleCount: 0,
      maxPlayers: 0
    };
  }
  
  return {
    playerCount: Object.keys(room.players).length,
    vehicleCount: Object.keys(room.vehicles).length,
    maxPlayers: room.maxPlayers
  };
};

// Broadcast a todos los players de la room main
export const broadcastToMain = (message: any, server: any) => {
  server.publish("main", JSON.stringify(message));
};