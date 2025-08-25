import { writable } from "svelte/store";
import type { Group } from "three";
import type { Vehicle } from "../types/types";

export const keys = writable({
  a: { isPressed: false },
  d: { isPressed: false },
  w: { isPressed: false },
  s: { isPressed: false },
  space: { isPressed: false },
  shift: { isPressed: false },
  e: { isPressed: false },
});

export const gameState = writable({
  controlMode: "player" as "player" | "vehicle",
  vehicles: [] as any[],
  player: {
    isVisible: true,
    isInVehicle: false,
    isOnGround: false,
    canMove: true,
    currentVehicle: undefined as string | undefined,
    canEnterVehicle: false,
    nearVehicleId: undefined as string | undefined,
    mainGroup: undefined as Group | undefined,
    exitPosition: undefined as { x: number; y: number; z: number } | undefined,
  },
  controls: {
    player: undefined as any,
    vehicles: new Map() as Map<string, any>,
  },
  vehicleStatus: {
    isOnGround: false,
    groundContacts: 0,
  },
});

export const gameActions = {
  registerVehicle: (vehicle: Vehicle) => {
    gameState.update((state) => {
      const exist = state.vehicles.find((v) => v.id === vehicle.id);

      if (exist) return state;

      return {
        ...state,
        vehicles: [...state.vehicles, vehicle],
      };
    });
  },
};

export const canMove = writable(false);
