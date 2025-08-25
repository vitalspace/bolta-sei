import RAPIER from "@dimforge/rapier3d-compat";
import * as path from "path";
import { vehicles } from "../entities/vehicles";
import { LocationManager } from "../locations/locationManager ";
import { PhysicsWorld } from "../physics/physisWorld";
import {
  type ILocation,
  type IPlayer,
  type IVehicle,
  LocationType,
} from "../types/types";

export class Room {
  id: string;
  name: string;
  players: Record<string, IPlayer> = {};
  playerSockets: Record<string, any> = {}; // Almacenar sockets por playerId
  vehicles: Record<string, IVehicle> = {};
  locations: Record<string, ILocation> = {};
  maxPlayers: number;
  currentPlayers = 0;
  createdAt: Date;

  world: RAPIER.World | null = null;
  physicsVehicles = new Map<string, any>();
  isPhysicsInitialized = false;

  server: any;
  private lastBroadcast = 0;
  private broadcastInterval = 33;

  locationManager: LocationManager;
  activeLocations: Set<string> = new Set();
  locationUpdateInterval: NodeJS.Timeout | null = null;

  constructor({
    id,
    name,
    maxPlayers,
    createdAt,
    server = null,
  }: {
    id: string;
    name: string;
    maxPlayers: number;
    createdAt: Date;
    server?: any;
  }) {
    this.id = id;
    this.name = name;
    this.maxPlayers = maxPlayers;
    this.createdAt = createdAt;
    this.server = server;

    this.locationManager = new LocationManager(this);
    this.initializeDefaultLocations();
    this.initializePhysics();
  }

  // ---- Players ----
  addPlayer = (player: IPlayer, socket?: any) => {
    if (this.currentPlayers >= this.maxPlayers) return;
    this.players[player.id] = player;
    if (socket) {
      this.playerSockets[player.id] = socket;
    }
    this.currentPlayers++;

    this.locationManager.movePlayerToLocation(player.id, "main_city");

    // console.log(this.locationManager.locations);
  };

  removePlayer = (playerId: string) => {
    if (!this.players[playerId]) return;

    // console.log("HERE", playerId);

    this.locationManager.removePlayerFromLocation(playerId);

    delete this.players[playerId];
    delete this.playerSockets[playerId]; // Limpiar socket también
    this.currentPlayers--;
  };

  // ---- Vehicles ----
  addVehicle = (vehicle: IVehicle) => {
    if (this.currentPlayers >= this.maxPlayers) return;
    this.vehicles[vehicle.id] = vehicle;
  };

  removeVehicle = (vehicleId: string) => {
    delete this.vehicles[vehicleId];
    this.removePhysicsVehicle(vehicleId);
  };

  createVehiclesWithPhysics = (
    data: Array<{
      id: string;
      position: [number, number, number];
      rotation: [number, number, number];
      color: string;
      type?: "car" | "airplane";
    }>
  ) => {
    if (!this.isPhysicsInitialized) return;
    for (const v of data) {
      this.vehicles[v.id] = {
        id: v.id,
        position: { x: v.position[0], y: v.position[1], z: v.position[2] },
        rotation: {
          x: v.rotation[0],
          y: v.rotation[1],
          z: v.rotation[2],
          w: 1,
        },
        color: v.color,
        type: v.type || "car",
        driverId: null,
        currentRoom: this.id,
      };
      this.addPhysicsVehicle(v);
    }
  };

  initializeVehiclesFromEntities = () => {
    if (!this.isPhysicsInitialized || !this.world) return;
    for (const v of Object.values(vehicles).filter(
      (v) => v.currentRoom === this.id
    )) {
      this.vehicles[v.id] = { ...v, driverId: null };
      this.addPhysicsVehicle({
        id: v.id,
        position: [v.position.x, v.position.y, v.position.z],
        rotation: [v.rotation.x, v.rotation.y, v.rotation.z],
        color: v.color,
        type: v.type,
      });
    }
  };

  getAllRoomVehicles = () => this.vehicles;
  getAllPhysicsVehicles = () => Array.from(this.physicsVehicles.values());

  // ---- Physics ----
  initializePhysics = async () => {
    if (this.isPhysicsInitialized) return;
    try {
      await RAPIER.init();
      this.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
      new PhysicsWorld(this.world, {
        gltfPath: path.resolve(process.cwd(), "public/city-transformed.glb"),
        physicsObjects: ["road", "general_ground"],
      }).init();
      this.isPhysicsInitialized = true;
      this.initializeVehiclesFromEntities();
      this.updatePhysics();
    } catch (err) {
      console.error(`Failed to init physics for ${this.name}:`, err);
    }
  };

  addPhysicsVehicle = (v: {
    id: string;
    position: [number, number, number];
    rotation: [number, number, number];
    color?: string;
    type?: "car" | "airplane";
  }) => {
    if (!this.world) return;
    const rb = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic().setTranslation(...v.position)
    );
    const collider = this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(1, 0.5, 2),
      rb
    );
    this.physicsVehicles.set(v.id, {
      id: v.id,
      rigidBody: rb,
      collider,
      driverId: null,
      color: v.color || "red",
      type: v.type || "car",
      controls: null,
    });
  };

  removePhysicsVehicle = (id: string) => {
    const v = this.physicsVehicles.get(id);
    if (v && this.world) this.world.removeRigidBody(v.rigidBody);
    this.physicsVehicles.delete(id);
  };

  applyVehicleControls = (vehicle: any) => {
    const { rigidBody, controls } = vehicle;
    if (!rigidBody || !controls) return;

    if (controls.realPosition && controls.realRotation) {
      const pos = rigidBody.translation();
      const target = controls.realPosition;
      const dist = Math.hypot(target.x - pos.x, target.z - pos.z);
      rigidBody.setTranslation(
        dist > 5
          ? target
          : {
              x: pos.x + (target.x - pos.x) * 0.3,
              y: target.y,
              z: pos.z + (target.z - pos.z) * 0.3,
            },
        true
      );
      rigidBody.setRotation(controls.realRotation, true);
      if (controls.realVelocity)
        rigidBody.setLinvel(controls.realVelocity, true);
      if (controls.realAngularVelocity)
        rigidBody.setAngvel(controls.realAngularVelocity, true);
      return;
    }

    let speed = controls.w ? (controls.shift ? 20 : 12) : controls.s ? -8 : 0;
    let turn = controls.a ? 2 : controls.d ? -2 : 0;
    rigidBody.setAngvel({ x: 0, y: turn, z: 0 }, true);

    if (speed) {
      const r = rigidBody.rotation();
      const forward = {
        x: 2 * (r.x * r.z + r.w * r.y),
        y: 0,
        z: 1 - 2 * (r.x * r.x + r.y * r.y),
      };
      rigidBody.setLinvel(
        { x: forward.x * speed, y: 0, z: forward.z * speed },
        true
      );
    } else {
      const v = rigidBody.linvel();
      rigidBody.setLinvel({ x: v.x * 0.9, y: v.y, z: v.z * 0.9 }, true);
    }
  };

  updatePhysics = () => {
    if (!this.world) return;
    this.world.step();

    for (const [id, v] of this.physicsVehicles) {
      if (v.driverId && v.controls) this.applyVehicleControls(v);
      if (v.rigidBody && this.vehicles[id]) {
        this.vehicles[id].position = v.rigidBody.translation();
        this.vehicles[id].rotation = v.rigidBody.rotation();
      }
    }

    this.broadcastVehiclePositions();
    setTimeout(this.updatePhysics, 16);
  };

  // ---- Networking ----
  setVehicleControls = (id: string, controls: any) => {
    const v = this.physicsVehicles.get(id);
    if (v) v.controls = controls;
  };

  setVehicleDriver = (id: string, driverId: string | null) => {
    if (this.physicsVehicles.has(id))
      this.physicsVehicles.get(id)!.driverId = driverId;
    if (this.vehicles[id]) this.vehicles[id].driverId = driverId;
  };

  setServer = (server: any) => {
    this.server = server;
  };

  broadcastVehiclePositions = () => {
    if (!this.server) return;
    const now = Date.now();
    if (now - this.lastBroadcast < this.broadcastInterval) return;

    const data = Object.values(this.vehicles)
      .filter((v) => v.position)
      .map((v) => ({
        id: v.id,
        position: v.position,
        rotation: v.rotation,
        driverId: v.driverId || null,
        color: v.color,
        type: v.type,
        currentRoom: v.currentRoom,
        currentLocation: v.currentLocation,
      }));

    const withoutDriver = data.filter((v) => !v.driverId);
    const withDriver = data.filter((v) => v.driverId);

    if (withoutDriver.length) {
      this.server.publish(
        this.id,
        JSON.stringify({
          type: "vehiclePositions",
          vehicles: withoutDriver,
          timestamp: now,
        })
      );
    }
    if (withDriver.length) {
      this.server.publish(
        this.id,
        JSON.stringify({
          type: "vehicleDriverStatus",
          vehicles: withDriver.map((v) => ({
            id: v.id,
            driverId: v.driverId,
          })),
          timestamp: now,
        })
      );
    }
    this.lastBroadcast = now;
  };

  // ---- Cleanup ----
  destroyPhysics = () => {
    for (const [id] of this.physicsVehicles) this.removePhysicsVehicle(id);
    this.world?.free();
    this.world = null;
    this.isPhysicsInitialized = false;
  };

  /// VEHICLES

  moveVehicleToLocation = (vehicleId: string, locationId: string): boolean => {
    const vehicle = this.vehicles[vehicleId];
    const location = this.locations[locationId];

    if (!vehicle || !location) return false;

    vehicle.currentLocation = locationId;

    if (vehicle.driverId)
      this.locationManager.movePlayerToLocation(vehicle.driverId, locationId);

    const spawnPoints = location.spawnPoints[0];

    if (spawnPoints && this.physicsVehicles.has(vehicleId)) {
      const physicsVehicle = this.physicsVehicles.get(vehicleId);
      physicsVehicle.rigidBody.setTranslation(
        new RAPIER.Vector3(spawnPoints.x, spawnPoints.y, spawnPoints.z),
        true
      );
    }

    return true;
  };

  getVehiclesByLocation = (locationId: string): IVehicle[] => {
    return Object.values(this.vehicles).filter(
      (v) => v.currentLocation === locationId
    );
  };

  getPlayersByLocation = (locationId: string): IPlayer[] => {
    const location = this.locations[locationId];
    if (!location) return [];

    return Array.from(location.currentPlayers)
      .map((playerId) => this.players[playerId])
      .filter((player): player is IPlayer => player !== undefined);
  };

  // Métodos para el sistema de locaciones (delegadores al LocationManager)
  movePlayerToLocation = (playerId: string, locationId: string): boolean => {
    return this.locationManager.movePlayerToLocation(playerId, locationId);
  };

  removePlayerFromLocation = (playerId: string): void => {
    this.locationManager.removePlayerFromLocation(playerId);
  };

  private initializeDefaultLocations(): void {
    const defaultLocations: ILocation[] = [
      {
        id: "main_city",
        name: "Ciudad Principal",
        type: LocationType.MIAN_CITY,
        capacity: 100,
        currentPlayers: new Set(),
        isActive: true, // Siempre activa
        activationThreshold: 1,
        deactivationDelay: 0,
        lastActivity: new Date(),
        spawnPoints: [
          { x: 0, y: 1, z: 0 },
          { x: 10, y: 1, z: 10 },
          { x: -10, y: 1, z: -10 },
        ],
        bounds: {
          min: { x: -100, y: 0, z: -100 },
          max: { x: 100, y: 50, z: 100 },
        },
        specificData: {},
      },
      {
        id: "racing_track",
        name: "Isla de Carreras",
        type: LocationType.RACING_TRACK,
        capacity: 8,
        currentPlayers: new Set(),
        isActive: false,
        activationThreshold: 2,
        deactivationDelay: 30000, // 30 segundos
        lastActivity: new Date(),
        spawnPoints: [
          { x: 253, y: 0.5, z: 170 },
          { x: 205, y: 1, z: 0 },
          { x: 210, y: 1, z: 0 },
          { x: 215, y: 1, z: 0 },
        ],
        bounds: {
          min: { x: 150, y: 0, z: -50 },
          max: { x: 300, y: 20, z: 50 },
        },
        specificData: {
          raceCheckpoints: [
            {
              id: 1,
              position: { x: 384.289, y: 0, z: 185.342 },
              radius: 5,
              order: 1,
            },
            {
              id: 2,
              position: { x: 339.62, y: 0, z: 135.844 },
              radius: 5,
              order: 2,
            },
            {
              id: 3,
              position: { x: 330.058, y: 0, z: -74.0771 },
              radius: 5,
              order: 3,
            },
            {
              id: 4,
              position: { x: 344.093, y: 42.4197, z: -240.027 },
              radius: 5,
              order: 4,
            },
            {
              id: 5,
              position: { x: 481.421, y: 21.7469, z: -127.243 },
              radius: 5,
              order: 4,
            },
            {
              id: 6,
              position: { x: 437.535, y: 11.3832, z: -84.5493 },
              radius: 5,
              order: 4,
            },
            {
              id: 7,
              position: { x: 344.905, y: 0, z: -33.5646 },
              radius: 5,
              order: 4,
            },
            {
              id: 8,
              position: { x: 468.989, y: 0, z: 65.1143 },
              radius: 5,
              order: 4,
            },
            {
              id: 9,
              position: { x: 440.014, y: 0, z: 24.2242 },
              radius: 5,
              order: 4,
            },
            {
              id: 10,
              position: { x: 513.052, y: 0, z: 202.895 },
              radius: 5,
              order: 4,
            },

            {
              id: 11,
              position: { x: 268.657, y: 0, z: 205.267 },
              radius: 5,
              order: 4,
            },
          ],
        },
      },
      {
        id: "club",
        name: "Club Nocturno",
        type: LocationType.CLUB,
        capacity: 20,
        currentPlayers: new Set(),
        isActive: false,
        activationThreshold: 1,
        deactivationDelay: 10000, // 10 segundos
        lastActivity: new Date(),
        spawnPoints: [
          { x: -200, y: 1, z: 0 },
          { x: -195, y: 1, z: 5 },
          { x: -205, y: 1, z: -5 },
        ],
        bounds: {
          min: { x: -250, y: 0, z: -30 },
          max: { x: -150, y: 15, z: 30 },
        },
        specificData: {},
      },
      {
        id: "chill_zone",
        name: "Zona de Relajación",
        type: LocationType.CHILL_ZONE,
        capacity: 15,
        currentPlayers: new Set(),
        isActive: false,
        activationThreshold: 1,
        deactivationDelay: 15000, // 15 segundos
        lastActivity: new Date(),
        spawnPoints: [
          { x: 0, y: 1, z: 200 },
          { x: 10, y: 1, z: 205 },
          { x: -10, y: 1, z: 195 },
        ],
        bounds: {
          min: { x: -50, y: 0, z: 150 },
          max: { x: 50, y: 25, z: 250 },
        },
        specificData: {},
      },
    ];

    defaultLocations.forEach((location) => {
      this.locations[location.id] = location;
      this.locationManager.locations.set(location.id, location);
    });
  }
}
