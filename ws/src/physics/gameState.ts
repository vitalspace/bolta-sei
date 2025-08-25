// import RAPIER from "@dimforge/rapier3d-compat";
import { setupPhysicsWorld } from "./worldSetup";
import { type IGameState, type IRoom } from "../types/types";
import { VehicleBroadcaster } from "./vehicleBroadcaster";

const mainRoom: IRoom = {
  id: "main",
  name: "Main Room",
  players: {},
  vehicles: {},
  locations: {}, // Inicializar locaciones vacías
  maxPlayers: 1000,
  createdAt: new Date(),
};

// Inicializar mundo físico con los mismos colliders que el frontend
const world = await setupPhysicsWorld({
  physicsObjects: ["road", "Ground", "parque"],
});

// Crear vehículos dinámicos
const vehicles = new Map();

// Ejemplo: Crear algunos carros en las mismas posiciones que el frontend
const carPositions = [
  {
    id: "car1",
    position: [253, 10, 190], // Posición en una zona con colliders de carretera
    rotation: [0, 0, 0],
    color: "#befc03",
  },

  {
    id: "car2",
    position: [253, 10, 180],
    rotation: [0, 0, 0],
    color: "#befc03",
  },

  // { id: "car2", position: [265, 20, 80], rotation: [0, 0, 0], color: "red" },
  // { id: "car3", position: [0, 2, 0], rotation: [0, 0, 0], color: "red" },

  // {
  //   id: "car3",
  //   position: [265, 20, 100],
  //   rotation: [0, Math.PI, 0],
  //   color: "green",
  // },
  // { id: "car4", position: [265, 20, 90], rotation: [0, 0, 0], color: "cyan" },
  // { id: "car5", position: [265, 20, 80], rotation: [0, 0, 0], color: "gold" },
];

// Crear RigidBodies para cada vehículo
for (const carData of carPositions) {
  const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(
      //@ts-ignore
      carData.position[0],
      carData.position[1],
      carData.position[2]
    )
    .setRotation({
      x: carData.rotation[0],
      y: carData.rotation[1],
      z: carData.rotation[2],
      w: 1,
    });

  const rigidBody = world.createRigidBody(rigidBodyDesc);

  // Collider del vehículo (mismo que en Car2.svelte)
  const colliderDesc = RAPIER.ColliderDesc.cuboid(1, 0.5, 2);
  world.createCollider(colliderDesc, rigidBody);

  vehicles.set(carData.id, {
    id: carData.id,
    rigidBody,
    driverId: null,
    color: carData.color,
    type: "car",
  });
}

export let gameState: IGameState = {
  players: {},
  vehicles: Object.fromEntries(vehicles),
  rooms: {
    main: mainRoom,
  },
};

// Importar LocationManager para configurar locaciones predefinidas
import { LocationManager } from "../utils/locationManager";

// Inicializar LocationManager
const locationManager = new LocationManager(gameState);

// Crear locaciones predefinidas en la room principal
const racingLocation = locationManager.createLocation(
  "main",
  "Racing Zone",
  "racing",
  {
    description: "Zona de carreras con pista circular",
    maxPlayers: 50,
    bounds: {
      min: { x: 200, y: 0, z: 150 },
      max: { x: 300, y: 50, z: 250 },
    },
  }
);

const socialLocation = locationManager.createLocation(
  "main",
  "Social Hub",
  "social",
  {
    description: "Área social para interactuar con otros jugadores",
    maxPlayers: 100,
    bounds: {
      min: { x: 0, y: 0, z: 0 },
      max: { x: 100, y: 50, z: 100 },
    },
  }
);

const explorationLocation = locationManager.createLocation(
  "main",
  "City Center",
  "exploration",
  {
    description: "Centro de la ciudad para explorar",
    maxPlayers: 200,
    bounds: {
      min: { x: 100, y: 0, z: 100 },
      max: { x: 200, y: 100, z: 200 },
    },
  }
);

console.log("🏢 Locaciones creadas:", {
  racing: racingLocation?.id,
  social: socialLocation?.id,
  exploration: explorationLocation?.id,
});

// Exportar LocationManager para uso en otros módulos
export { locationManager };

// Exportar referencia a los vehículos físicos para acceso desde eventos
export { vehicles as physicsVehicles };

// Contador para actualizar locaciones menos frecuentemente
let locationUpdateCounter = 0;

function updatePhysics() {
  world.step();

  // Actualizar posiciones de vehículos
  for (const [vehicleId, vehicle] of vehicles) {
    // Aplicar controles del vehículo ANTES de obtener la posición
    if (vehicle.driverId && vehicle.controls) {
      applyVehicleControls(vehicle);
    }

    const pos = vehicle.rigidBody.translation();
    const rot = vehicle.rigidBody.rotation();

    if (gameState.vehicles[vehicleId]) {
      gameState.vehicles[vehicleId].position = pos;
      gameState.vehicles[vehicleId].rotation = rot;
    }
  }

  // Actualizar locaciones cada 30 frames (aproximadamente cada 0.5 segundos)
  locationUpdateCounter++;
  if (locationUpdateCounter >= 30) {
    locationManager.autoAssignPlayersByPosition("main");
    locationUpdateCounter = 0;
  }

  // Enviar posiciones actualizadas con menos frecuencia para evitar spam
  if (broadcaster) {
    broadcaster.broadcastNow();
  }

  // Mantener 60 FPS para el loop de física
  setTimeout(updatePhysics, 16);
}

// Función para aplicar controles del vehículo
function applyVehicleControls(vehicle: any) {
  const { rigidBody, controls } = vehicle;

  if (!rigidBody || !controls) return;

  // PRIORIDAD 1: Si el conductor envía su posición real, usarla directamente
  // Esto incluye colisiones y física real del frontend
  if (controls.realPosition && controls.realRotation) {
    const currentPos = rigidBody.translation();
    const targetPos = controls.realPosition;

    // Calcular distancia para determinar si necesitamos interpolación o teleport
    const distance = Math.sqrt(
      Math.pow(targetPos.x - currentPos.x, 2) +
        Math.pow(targetPos.z - currentPos.z, 2)
    );

    // Si la distancia es muy grande, teleportar directamente (evita desincronización)
    if (distance > 5) {
      rigidBody.setTranslation(targetPos, true);
    } else {
      // Interpolación suave para distancias pequeñas
      const lerpFactor = 0.3; // Menos agresivo para evitar rebotes
      const newPos = {
        x: currentPos.x + (targetPos.x - currentPos.x) * lerpFactor,
        y: targetPos.y, // Usar Y directamente para evitar problemas de altura
        z: currentPos.z + (targetPos.z - currentPos.z) * lerpFactor,
      };
      rigidBody.setTranslation(newPos, true);
    }

    // Aplicar rotación directamente (sin interpolación para evitar giros extraños)
    rigidBody.setRotation(controls.realRotation, true);

    // Aplicar velocidades reales para física consistente
    if (controls.realVelocity) {
      rigidBody.setLinvel(controls.realVelocity, true);
    }

    if (controls.realAngularVelocity) {
      rigidBody.setAngvel(controls.realAngularVelocity, true);
    }

    return; // No calcular física propia si tenemos datos reales
  }

  // PRIORIDAD 2: Si solo tenemos controles de teclado, aplicar física simplificada
  if (controls.w || controls.s || controls.a || controls.d) {
    let currentVelocity = 0;
    let angularVelocity = 0;

    // Aplicar controles basados en las teclas presionadas
    if (controls.w && controls.shift) {
      currentVelocity = 20; // Reducir velocidad para mejor control
    } else if (controls.w) {
      currentVelocity = 12;
    } else if (controls.s) {
      currentVelocity = -8;
    }

    // Rotación basada en A/D
    if (controls.a) {
      angularVelocity = 2;
    } else if (controls.d) {
      angularVelocity = -2;
    }

    // Aplicar rotación
    if (angularVelocity !== 0) {
      rigidBody.setAngvel({ x: 0, y: angularVelocity, z: 0 }, true);
    } else {
      rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    // Aplicar movimiento basado en la rotación actual del vehículo
    if (currentVelocity !== 0) {
      const rotation = rigidBody.rotation();
      const forward = {
        x: 2 * (rotation.x * rotation.z + rotation.w * rotation.y),
        y: 0,
        z: 1 - 2 * (rotation.x * rotation.x + rotation.y * rotation.y),
      };

      rigidBody.setLinvel(
        {
          x: forward.x * currentVelocity,
          y: 0,
          z: forward.z * currentVelocity,
        },
        true
      );
    } else {
      // Detener el movimiento lineal si no hay teclas presionadas
      rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  } else {
    // Sin controles activos, detener el vehículo gradualmente
    const currentVel = rigidBody.linvel();
    rigidBody.setLinvel(
      {
        x: currentVel.x * 0.9, // Fricción
        y: currentVel.y,
        z: currentVel.z * 0.9,
      },
      true
    );
    rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }
}

// Variable para el broadcaster
let broadcaster: VehicleBroadcaster | null = null;

// Función para inicializar el broadcaster (se llamará desde index.ts)
export function initVehicleBroadcaster(server: any) {
  broadcaster = new VehicleBroadcaster(gameState, server);
  // console.log(
  //   "🚗 Vehicle broadcaster initialized - will broadcast with physics loop"
  // );
  return broadcaster;
}

updatePhysics();
