export type AnimationKey = "Idle" | "Walking" | "Running";

export interface PlayerAnimationData {
  current: AnimationKey;
  changed: boolean;
  timestamp?: number;
}

export interface PlayerLocationData {
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  animation?: PlayerAnimationData;
}

export interface NetworkPlayer {
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
  };
  animation?: PlayerAnimationData;
  currentRoom: string;
}