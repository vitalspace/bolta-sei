import { serve } from "bun";
import type {
  CustomWebSocket,
  IGameState,
  IHandleParams,
} from "../types/types";

import { chat } from "./events/chat/chat";
import {
  locationEnter,
  locationExit,
  locationStateRequest,
  locationTeleport,
  raceCheckpointCrossed,
} from "./events/locations/locationEvents";
import { music } from "./events/music/music";
import { vip } from "./events/player/isVip";
import { location } from "./events/player/location";
import { vehicleControls } from "./events/vehicles/vehicleControls";
import { vehicleEnter } from "./events/vehicles/vehicleEnter";
import { vehicleExit } from "./events/vehicles/vehicleExit";
import { vehicleSync } from "./events/vehicles/vehicleSync";
import { vehicleUpdate } from "./events/vehicles/vehicleUpdate";

const handles: Record<string, (params: IHandleParams) => void> = {
  chat: chat,
  music: music,
  vip: vip,
  playerLocation: location,
  vehicleSync: vehicleSync,
  vehicleUpdate: vehicleUpdate,
  vehicleEnter: vehicleEnter,
  vehicleExit: vehicleExit,
  vehicleControls: vehicleControls,
  // Nuevos handlers de locaciones
  "location:enter": locationEnter,
  // "location:exit": locationExit,
  // "location:state_request": locationStateRequest,
  // "location:teleport": locationTeleport,
  // "race:checkpoint_crossed": raceCheckpointCrossed,
};

export const onMessages = (
  server: ReturnType<typeof serve>,
  ws: CustomWebSocket,
  message: string,
  gameState: IGameState
) => {
  const data = JSON.parse(message);

  const params = {
    server,
    ws,
    data,
    gameState,
  };

  const handler = handles[data.type];
  if (handler) handler(params);
};
