import type { Group } from "three";

export interface Vehicle {
  id: string;
  isActive: boolean;
  reference: Group;
  position: [number, number, number];
  rotation: [number, number, number];
  type: "car" | "airplane";
}

export interface SocketMessage {
  type: string;
  data?: any;
}
