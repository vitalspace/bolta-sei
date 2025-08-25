import type { IHandleParams, IRoom } from "../../../types/types";

export const vehicleControls = ({
  server,
  ws,
  data,
  gameState,
}: IHandleParams) => {
  const { players, vehicles } = gameState.rooms.main as IRoom;
  const player = players[ws.id];

  if (!player) return;

  //@ts-ignore
  const vehicleId = data.vehicleId;
  //@ts-ignore
  const controls = data.controls; // { w: boolean, a: boolean, s: boolean, d: boolean, shift: boolean }

  const vehicle = vehicles[vehicleId];

  if (!vehicle || vehicle.driverId !== ws.id) {
    return; // El jugador no está autorizado a controlar este vehículo
  }

  const physicsVehicle = vehicles[vehicleId];
  if (physicsVehicle) {
    physicsVehicle.controls = controls;
  }

  // Si el conductor envía su posición real, actualizar el gameState inmediatamente
  if (controls.realPosition && controls.realRotation) {
    vehicle.position = controls.realPosition;
    vehicle.rotation = controls.realRotation;

    // Enviar la posición real a otros jugadores inmediatamente
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
  }
};
