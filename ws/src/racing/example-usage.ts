import type { ILocation, IRaceCheckpoint } from "../types/types";
import { LocationType } from "../types/types";
import { RaceManager } from "./RaceManager";

/**
 * Ejemplo simple de cómo crear una ubicación de carreras con checkpoints manuales
 */

// Definir checkpoints manualmente como mencionaste
const raceCheckpoints: IRaceCheckpoint[] = [
  {
    id: 1,
    position: { x: 0, y: 0, z: 0 },
    radius: 5,
    order: 1
  },
  {
    id: 2,
    position: { x: 10, y: 0, z: 5 },
    radius: 5,
    order: 2
  },
  {
    id: 3,
    position: { x: 20, y: 0, z: 10 },
    radius: 5,
    order: 3
  },
  {
    id: 4,
    position: { x: 30, y: 0, z: 15 },
    radius: 5,
    order: 4
  }
];

// Crear ubicación de carreras
export function createSimpleRacingTrack(): ILocation {
  return {
    id: "simple_racing_track",
    name: "Circuito Simple",
    type: LocationType.RACING_TRACK,
    capacity: 10,
    currentPlayers: new Set(),
    isActive: false,
    activationThreshold: 2,
    deactivationDelay: 30000,
    lastActivity: new Date(),
    spawnPoints: [
      { x: -5, y: 0, z: -5 },
      { x: -10, y: 0, z: -5 },
      { x: -15, y: 0, z: -5 },
      { x: -20, y: 0, z: -5 }
    ],
    bounds: {
      min: { x: -30, y: 0, z: -30 },
      max: { x: 50, y: 10, z: 50 }
    },
    specificData: {
      raceCheckpoints: raceCheckpoints
    }
  };
}

// Ejemplo de uso
export function exampleUsage() {
  // 1. Crear la ubicación
  const racingTrack = createSimpleRacingTrack();
  
  // 2. Agregar al room (esto lo harías en tu locationManager)
  // room.locations[racingTrack.id] = racingTrack;
  
  // 3. Cuando los jugadores entren y sean ≥2, se activará automáticamente
  // RaceManager.activateRace(racingTrack, room);
  
  // 4. Para manejar cruce de checkpoints desde el frontend:
  // RaceManager.handleCheckpointCrossing(racingTrack, room, playerId, checkpointId);
  
  console.log("Racing track created with", racingTrack.specificData.raceCheckpoints.length, "checkpoints");
  return racingTrack;
}

// Función helper para crear checkpoints fácilmente
export function createCheckpoint(
  id: number, 
  x: number, 
  y: number, 
  z: number, 
  radius: number = 5
): IRaceCheckpoint {
  return {
    id,
    position: { x, y, z },
    radius,
    order: id
  };
}

// Ejemplo de crear checkpoints con la función helper
export function createCustomTrackCheckpoints(): IRaceCheckpoint[] {
  return [
    createCheckpoint(0, 0, 2, 0, 10),    // Start/finish - radio más grande
    createCheckpoint(1, 25, 2, 10),      // Primera curva
    createCheckpoint(2, 45, 2, 30),      // Recta lateral
    createCheckpoint(3, 40, 2, 60),      // Curva superior
    createCheckpoint(4, 15, 2, 70),      // Recta superior
    createCheckpoint(5, -10, 2, 50),     // Curva izquierda
    createCheckpoint(6, -15, 2, 20),     // Bajada
    createCheckpoint(7, -5, 2, -10),     // Curva inferior
    createCheckpoint(8, 20, 2, -15),     // Aproximación final
    createCheckpoint(9, 35, 2, -5)       // Última curva antes de meta
  ];
}