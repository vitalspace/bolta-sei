import { RaceManager } from "./RaceManager";

import { RaceManager } from "./RaceManager";

import { RaceManager } from "./RaceManager";

// Racing System - Simplified exports
export { RaceManager } from "./RaceManager";
export { createSimpleRacingTrack, createCheckpoint, createCustomTrackCheckpoints } from "./example-usage";

// Quick access functions
export const activateRace = (location: any, room: any) => RaceManager.activateRace(location, room);
export const getRaceStatus = (location: any) => RaceManager.getRaceStatus(location);
export const handleCheckpointCrossing = (location: any, room: any, playerId: string, checkpointId: number) => 
  RaceManager.handleCheckpointCrossing(location, room, playerId, checkpointId);