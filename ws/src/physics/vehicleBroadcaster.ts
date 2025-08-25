import type { IGameState } from "../types/types";

export class VehicleBroadcaster {
  private gameState: IGameState;
  private server: any;
  private lastBroadcast: number = 0;
  private broadcastInterval: number = 33; // ~30 FPS en lugar de 60

  constructor(gameState: IGameState, server: any) {
    this.gameState = gameState;
    this.server = server;
  }

  // Método público para enviar con throttling (llamado desde el loop de física)
  broadcastNow() {
    const now = Date.now();
    if (now - this.lastBroadcast >= this.broadcastInterval) {
      this.broadcastVehiclePositions();
      this.lastBroadcast = now;
    }
  }

  private broadcastVehiclePositions() {
    // Crear mensaje con posiciones actuales de todos los vehículos
    const vehiclePositions = Object.entries(this.gameState.vehicles)
      .map(([id, vehicle]) => ({
        id,
        position: vehicle.position,
        rotation: vehicle.rotation,
        driverId: vehicle.driverId || null,
      }))
      .filter((vehicle) => vehicle.position); // Solo vehículos con posición válida

    if (vehiclePositions.length === 0) return;

    // Separar vehículos con y sin conductor
    const vehiclesWithoutDriver = vehiclePositions.filter(v => !v.driverId);
    const vehiclesWithDriver = vehiclePositions.filter(v => v.driverId);

    // Enviar posiciones de vehículos sin conductor (para sincronización general)
    if (vehiclesWithoutDriver.length > 0) {
      const message = JSON.stringify({
        type: "vehiclePositions",
        vehicles: vehiclesWithoutDriver,
        timestamp: Date.now(),
      });
      this.server.publish("main", message);
    }

    // Para vehículos con conductor, solo enviar información de estado (no posición)
    if (vehiclesWithDriver.length > 0) {
      const driverStatusMessage = JSON.stringify({
        type: "vehicleDriverStatus",
        vehicles: vehiclesWithDriver.map(v => ({
          id: v.id,
          driverId: v.driverId
        })),
        timestamp: Date.now(),
      });
      this.server.publish("main", driverStatusMessage);
    }
  }
}
