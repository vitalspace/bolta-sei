import { randomUUIDv7 } from "bun";
import type { ILocation, IPlayer, IVehicle, IGameState, IRoom } from "../types/types";

export class LocationManager {
  private gameState: IGameState;

  constructor(gameState: IGameState) {
    this.gameState = gameState;
  }

  // Crear una nueva locación dentro de una room
  createLocation(
    roomId: string,
    name: string,
    type: ILocation["type"],
    options: {
      description?: string;
      maxPlayers?: number;
      bounds?: ILocation["bounds"];
    } = {}
  ): ILocation | null {
    const room = this.gameState.rooms[roomId];
    if (!room) return null;

    const locationId = randomUUIDv7();
    const location: ILocation = {
      id: locationId,
      name,
      description: options.description,
      roomId,
      players: {},
      vehicles: {},
      maxPlayers: options.maxPlayers || 20,
      bounds: options.bounds,
      type,
      isActive: true,
      createdAt: new Date(),
    };

    room.locations[locationId] = location;
    return location;
  }

  // Obtener una locación por ID
  getLocation(locationId: string): ILocation | null {
    for (const room of Object.values(this.gameState.rooms)) {
      if (room.locations[locationId]) {
        return room.locations[locationId];
      }
    }
    return null;
  }

  // Obtener todas las locaciones de una room
  getRoomLocations(roomId: string): Record<string, ILocation> {
    const room = this.gameState.rooms[roomId];
    return room ? room.locations : {};
  }

  // Mover un player a una locación
  movePlayerToLocation(playerId: string, locationId: string): boolean {
    const location = this.getLocation(locationId);
    const player = this.gameState.players[playerId];

    if (!location || !player) return false;
    if (Object.keys(location.players).length >= location.maxPlayers) return false;

    // Verificar que el player esté en la room correcta
    if (player.currentRoom !== location.roomId) return false;

    const oldLocationId = player.currentLocation;

    // Remover de locación anterior si existe
    if (player.currentLocation) {
      this.removePlayerFromLocation(playerId, player.currentLocation);
    }

    // Agregar a nueva locación
    location.players[playerId] = player;
    player.currentLocation = locationId;

    // Notificar cambio de locación
    this.notifyLocationChange(playerId, oldLocationId, locationId);

    // Notificar a todos los players en la locación
    this.broadcastLocationUpdate(locationId);
    
    return true;
  }

  // Remover un player de una locación
  removePlayerFromLocation(playerId: string, locationId: string): boolean {
    const location = this.getLocation(locationId);
    if (!location || !location.players[playerId]) return false;

    delete location.players[playerId];

    // Limpiar la locación del player
    if (this.gameState.players[playerId]) {
      this.gameState.players[playerId].currentLocation = undefined;
    }

    // Notificar cambio de locación
    this.notifyLocationChange(playerId, locationId, undefined);

    // Notificar cambios
    this.broadcastLocationUpdate(locationId);
    
    return true;
  }

  // Mover un vehículo a una locación
  moveVehicleToLocation(vehicleId: string, locationId: string): boolean {
    const location = this.getLocation(locationId);
    const vehicle = this.gameState.vehicles[vehicleId];

    if (!location || !vehicle) return false;
    if (vehicle.currentRoom !== location.roomId) return false;

    // Remover de locación anterior si existe
    if (vehicle.currentLocation) {
      this.removeVehicleFromLocation(vehicleId, vehicle.currentLocation);
    }

    // Agregar a nueva locación
    location.vehicles[vehicleId] = vehicle;
    vehicle.currentLocation = locationId;

    this.broadcastLocationUpdate(locationId);
    return true;
  }

  // Remover un vehículo de una locación
  removeVehicleFromLocation(vehicleId: string, locationId: string): boolean {
    const location = this.getLocation(locationId);
    if (!location || !location.vehicles[vehicleId]) return false;

    delete location.vehicles[vehicleId];

    if (this.gameState.vehicles[vehicleId]) {
      this.gameState.vehicles[vehicleId].currentLocation = undefined;
    }

    this.broadcastLocationUpdate(locationId);
    return true;
  }

  // Verificar si un player está dentro de los bounds de una locación
  checkPlayerInLocationBounds(playerId: string, locationId: string): boolean {
    const location = this.getLocation(locationId);
    const player = this.gameState.players[playerId];

    if (!location || !player || !location.bounds) return false;

    const pos = player.position;
    const bounds = location.bounds;

    return (
      pos.x >= bounds.min.x && pos.x <= bounds.max.x &&
      pos.y >= bounds.min.y && pos.y <= bounds.max.y &&
      pos.z >= bounds.min.z && pos.z <= bounds.max.z
    );
  }

  // Auto-asignar players a locaciones basado en su posición
  autoAssignPlayersByPosition(roomId: string): void {
    const room = this.gameState.rooms[roomId];
    if (!room) return;

    for (const player of Object.values(room.players)) {
      // Solo procesar players que están en esta room
      if (player.currentRoom !== roomId) continue;

      let foundLocation = false;

      // Verificar cada locación de la room
      for (const location of Object.values(room.locations)) {
        if (!location.isActive || !location.bounds) continue;

        const isInBounds = this.checkPlayerInLocationBounds(player.id, location.id);
        const isCurrentlyInLocation = player.currentLocation === location.id;

        if (isInBounds && !isCurrentlyInLocation) {
          // Player entró a una nueva locación
          this.movePlayerToLocation(player.id, location.id);
          foundLocation = true;
          break;
        } else if (!isInBounds && isCurrentlyInLocation) {
          // Player salió de la locación
          this.removePlayerFromLocation(player.id, location.id);
        }
      }

      // Si el player no está en ninguna locación específica, limpiar su locación actual
      if (!foundLocation && player.currentLocation) {
        const currentLocation = this.getLocation(player.currentLocation);
        if (currentLocation && !this.checkPlayerInLocationBounds(player.id, player.currentLocation)) {
          this.removePlayerFromLocation(player.id, player.currentLocation);
        }
      }
    }
  }

  // Obtener el estado de una locación
  getLocationState(locationId: string) {
    const location = this.getLocation(locationId);
    if (!location) return null;

    return {
      id: location.id,
      name: location.name,
      description: location.description,
      type: location.type,
      roomId: location.roomId,
      players: Object.keys(location.players).map(playerId => ({
        id: playerId,
        ...location.players[playerId]
      })),
      vehicles: Object.keys(location.vehicles).map(vehicleId => ({
        id: vehicleId,
        ...location.vehicles[vehicleId]
      })),
      playerCount: Object.keys(location.players).length,
      vehicleCount: Object.keys(location.vehicles).length,
      maxPlayers: location.maxPlayers,
      bounds: location.bounds,
      isActive: location.isActive,
      createdAt: location.createdAt,
    };
  }

  // Listar todas las locaciones activas de una room
  listRoomLocations(roomId: string) {
    const locations = this.getRoomLocations(roomId);
    return Object.values(locations)
      .filter(loc => loc.isActive)
      .map(location => ({
        id: location.id,
        name: location.name,
        description: location.description,
        type: location.type,
        playerCount: Object.keys(location.players).length,
        vehicleCount: Object.keys(location.vehicles).length,
        maxPlayers: location.maxPlayers,
        isActive: location.isActive,
      }));
  }

  // Broadcast de cambios en una locación a todos los players de la room
  private broadcastLocationUpdate(locationId: string): void {
    const location = this.getLocation(locationId);
    if (!location) return;

    const room = this.gameState.rooms[location.roomId];
    if (!room) return;

    const locationState = this.getLocationState(locationId);
    
    // Aquí puedes implementar el broadcast real usando WebSockets
    // Por ahora solo loggeamos el cambio
    console.log(`📍 Location update: ${location.name} (${Object.keys(location.players).length} players)`);
    
    // TODO: Implementar broadcast real a través del servidor WebSocket
    // this.broadcastToRoom(location.roomId, {
    //   type: 'location_update',
    //   data: locationState
    // });
  }

  // Notificar cambio de locación
  private notifyLocationChange(playerId: string, oldLocationId: string | undefined, newLocationId: string | undefined): void {
    const player = this.gameState.players[playerId];
    if (!player) return;

    console.log(`🚶 Player ${playerId} moved from location ${oldLocationId || 'none'} to ${newLocationId || 'none'}`);
    
    // Aquí puedes agregar lógica adicional como:
    // - Enviar notificación específica al player
    // - Actualizar estadísticas de tiempo en locaciones
    // - Triggear eventos especiales por locación
    // - Aplicar buffs/debuffs específicos de la locación
    
    const locationChangeData = {
      playerId,
      oldLocationId,
      newLocationId,
      timestamp: new Date().toISOString(),
    };

    // TODO: Enviar notificación al player específico
    // this.sendToPlayer(playerId, {
    //   type: 'location_changed',
    //   data: locationChangeData
    // });
  }

  // Eliminar una locación
  deleteLocation(locationId: string): boolean {
    const location = this.getLocation(locationId);
    if (!location) return false;

    const room = this.gameState.rooms[location.roomId];
    if (!room) return false;

    // Mover todos los players y vehículos fuera de la locación
    for (const playerId of Object.keys(location.players)) {
      this.removePlayerFromLocation(playerId, locationId);
    }

    for (const vehicleId of Object.keys(location.vehicles)) {
      this.removeVehicleFromLocation(vehicleId, locationId);
    }

    // Eliminar la locación
    delete room.locations[locationId];
    return true;
  }

  // Activar/desactivar una locación
  toggleLocation(locationId: string, isActive: boolean): boolean {
    const location = this.getLocation(locationId);
    if (!location) return false;

    location.isActive = isActive;

    if (!isActive) {
      // Si se desactiva, remover todos los players y vehículos
      for (const playerId of Object.keys(location.players)) {
        this.removePlayerFromLocation(playerId, locationId);
      }
      for (const vehicleId of Object.keys(location.vehicles)) {
        this.removeVehicleFromLocation(vehicleId, locationId);
      }
    }

    return true;
  }
}