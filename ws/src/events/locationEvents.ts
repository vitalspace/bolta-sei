// Eventos relacionados con locaciones
// NOTA: Este archivo está deshabilitado porque gameState está comentado
// TODO: Reactivar cuando se implemente el nuevo sistema de locaciones

import type { IHandleParams, ILocation } from "../types/types";

/*
import { locationManager } from "../physics/gameState";

// Manejar eventos relacionados con locaciones
export function handleLocationEvents(params: IHandleParams) {
  const { ws, data, gameState } = params;
  
  try {
    const message = JSON.parse(data);
    
    switch (message.type) {
      case "get_room_locations":
        handleGetRoomLocations(ws, message, gameState);
        break;
        
      case "get_location_state":
        handleGetLocationState(ws, message, gameState);
        break;
        
      case "join_location":
        handleJoinLocation(ws, message, gameState);
        break;
        
      case "leave_location":
        handleLeaveLocation(ws, message, gameState);
        break;
        
      default:
        // No es un evento de locación, no hacer nada
        return false;
    }
    
    return true; // Evento manejado
  } catch (error) {
    console.error("Error handling location event:", error);
    return false;
  }
}

// ... resto del código comentado ...
*/

// Funciones temporalmente deshabilitadas
export function handleLocationEvents(params: IHandleParams) { return false; }
export function broadcastLocationUpdate(locationId: string, gameState: any) { }
export function notifyLocationChange(playerId: string, oldLocationId: string | undefined, newLocationId: string | undefined) { }