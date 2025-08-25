// Ejemplo de cómo usar el sistema de locaciones
// NOTA: Este archivo está deshabilitado porque gameState está comentado
// TODO: Reactivar cuando se implemente el nuevo sistema de locaciones

/*
import { gameState, locationManager } from "../physics/gameState";
import type { IPlayer } from "../types/types";

// Ejemplo 1: Crear una nueva locación de carreras
export function createRacingTrack() {
  const racingTrack = locationManager.createLocation("main", "Speed Circuit", "racing", {
    description: "Pista de carreras de alta velocidad",
    maxPlayers: 20,
    bounds: {
      min: { x: 300, y: 0, z: 200 },
      max: { x: 400, y: 30, z: 300 }
    }
  });

  console.log("🏁 Racing track created:", racingTrack?.id);
  return racingTrack;
}

// Ejemplo 2: Crear una zona de combate
export function createCombatZone() {
  const combatZone = locationManager.createLocation("main", "Battle Arena", "combat", {
    description: "Arena de combate PvP",
    maxPlayers: 10,
    bounds: {
      min: { x: 400, y: 0, z: 300 },
      max: { x: 500, y: 50, z: 400 }
    }
  });

  console.log("⚔️ Combat zone created:", combatZone?.id);
  return combatZone;
}

// ... resto del código comentado ...
*/

// Archivo temporalmente deshabilitado
export function createRacingTrack() { return null; }
export function createCombatZone() { return null; }
export function movePlayerToRacing(playerId: string) { return false; }
export function getLocationStats() { return []; }
export function startRaceEvent() { return null; }
export function startLocationMonitor() { }
export function createEventLocation(eventType: "tournament" | "party" | "meeting", playerCount: number) { return null; }
export function checkLocationRewards(playerId: string) { return null; }
export function initializeExamples() { }