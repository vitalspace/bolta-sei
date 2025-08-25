import { type ServerWebSocket, serve } from "bun";

export interface CustomWebSocket extends ServerWebSocket {
  id: string;
}

export interface IPlayer {
  id: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  animation?: {
    current: "Idle" | "Walking" | "Running";
    changed: boolean;
    timestamp: number;
  };
  health: number;
  currentRoom: string;
  currentLocation?: string; // Nueva propiedad para locaciones
  isVip?: boolean;
}

export interface IVehicle {
  id: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  type: "car" | "airplane";
  color?: string; // Color del vehículo
  currentRoom: string;
  currentLocation?: string; // Nueva propiedad para locaciones
  driverId?: string | null; // ID del jugador que conduce el vehículo
}

export interface IRoom {
  locationManager: any;
  getLocationState(locationId: any): unknown;
  moveVehicleToLocation(vehicleId: any, locationId: any): unknown;
  movePlayerToLocation(playerId: any, locationId: any): unknown;
  id: string;
  name: string;
  players: Record<string, IPlayer>;
  vehicles: Record<string, IVehicle>;
  locations: Record<string, ILocation>;
  maxPlayers: number;
  currentPlayers: number;
  createdAt: Date;
  addPlayer(player: IPlayer, ws: CustomWebSocket): void;
  addVehicle(vehicle: IVehicle): void;
  removePlayer(playerId: string): void;
  removeVehicle(vehicleId: string): void;
}

export interface IGameState {
  rooms: Record<string, IRoom>;
}

export interface IHandleParams {
  server: ReturnType<typeof serve>;
  ws: CustomWebSocket;
  data: string;
  gameState: IGameState;
}

export interface PhysicsConfig {
  gltfPath: string;
  physicsObjects: string[];
}

export enum LocationType {
  MIAN_CITY = "main_city",
  RACING_TRACK = "racing_track",
  CLUB = "club",
  CHILL_ZONE = "chill_zone",
}

export interface ILocation {
  id: string;
  name: string;
  type: LocationType;
  capacity: number;
  currentPlayers: Set<string>;
  isActive: boolean;
  activationThreshold: number;
  deactivationDelay: number;
  lastActivity: Date;
  spawnPoints: Array<{
    x: number;
    y: number;
    z: number;
  }>;
  bounds: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
  };
  specificData: any; // Aquí van los datos específicos por tipo de ubicación
}

//////////////////// Racing ////////////////////

export interface IRaceCheckpoint {
  id: number;
  position: { x: number; y: number; z: number };
  radius: number;
  order: number;
}

export interface IRaceParticipant {
  playerId: string;
  vehicleId?: string;
  currentCheckpoint: number;
  checkpointTimes: number[];
  totalTime: number;
  position: number; // Position in race (1st, 2nd, 3rd, etc.)
  isFinished: boolean;
  startTime: number;
}

export interface IRaceData {
  locationId: string;
  participants: Map<string, IRaceParticipant>;
  checkpoints: IRaceCheckpoint[];
  totalCheckpoints: number;
  status: "waiting" | "countdown" | "racing" | "finished";
  countDown: number;
  startTime: number;
  maxDuration: number;
  leaderboard: string[];
}
