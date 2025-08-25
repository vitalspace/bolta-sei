import type { IHandleParams, IRoom } from "../../../types/types";

export const vehicleUpdate = ({
  server,
  ws,
  data,
  gameState,
}: IHandleParams) => {
  const { players, vehicles } = gameState.rooms.main as IRoom;
  const player = players[ws.id];

  if (!player) return;

  // Verificar que el jugador esté conduciendo un vehículo
  //@ts-ignore
  const vehicleId = data.vehicleId;
  const vehicle = vehicles[vehicleId];

  if (!vehicle || vehicle.driverId !== ws.id) {
    return; // El jugador no está autorizado a controlar este vehículo
  }

  // Actualizar posición del vehículo
  //@ts-ignore
  vehicle.position = data.position;
  //@ts-ignore
  vehicle.rotation = data.rotation;

  // Propagar la actualización a todos los jugadores en la sala
  ws.publish(
    player.currentRoom,
    JSON.stringify({
      type: "vehicleUpdate",
      vehicleId,
      position: vehicle.position,
      rotation: vehicle.rotation,
      driverId: vehicle.driverId,
    })
  );
};
