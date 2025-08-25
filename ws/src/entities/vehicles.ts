import { color, randomUUIDv7 } from "bun";

const vehiclesList = [
  {
    id: randomUUIDv7(),
    position: {
      x: 253,
      y: 6, // Just above the road area at Y=3
      z: 190,
    },
    rotation: {
      x: 0,
      y: Math.PI,
      z: 0,
      w: 2,
    },
    type: "car" as const,
    currentRoom: "main",
    color: "green",
  },
  {
    id: randomUUIDv7(),
    position: {
      x: 253,
      y: 6, // Just above the road area at Y=3
      z: 180,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
      w: 1,
    },
    type: "car" as const,
    currentRoom: "main",
    color: "gold",
  },
  {
    id: randomUUIDv7(),
    position: {
      x: 253,
      y: 6, // Just above the road area at Y=3
      z: 170,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
      w: 1,
    },
    type: "car" as const,
    currentRoom: "main",
    color: "yellow",
  },

  {
    id: randomUUIDv7(),
    position: {
      x: 0,
      y: 10, // Just above the road area at Y=3
      z: 40,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
      w: 1,
    },
    type: "car" as const,
    currentRoom: "main",
    color: "yellow",
  },
];

// Convertir array a Record<string, IVehicle>
export const vehicles = vehiclesList.reduce((acc, vehicle) => {
  acc[vehicle.id] = vehicle;
  return acc;
}, {} as Record<string, any>);
