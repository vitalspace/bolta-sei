import type { IHandleParams, IRoom } from "../../../types/types";

export const vehicleEnter = ({
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
  const vehicle = vehicles[vehicleId];

  console.log(vehicle);

  if (!vehicle) {
    ws.send(
      JSON.stringify({
        type: "vehicleEnterError",
        message: "Vehicle not found",
      })
    );
    return;
  }

  // Verificar que el vehículo esté disponible
  if (vehicle.driverId) {
    ws.send(
      JSON.stringify({
        type: "vehicleEnterError",
        message: "Vehicle is already occupied",
      })
    );
    return;
  }

  // Asignar el vehículo al jugador
  vehicle.driverId = ws.id;

  // IMPORTANTE: También asignar en el vehículo físico
  const physicsVehicle = vehicles[vehicleId];
  if (physicsVehicle) {
    physicsVehicle.driverId = ws.id;
    console.log(`🚗 Player ${ws.id} entered vehicle ${vehicleId}`);
  }

  // Confirmar entrada al jugador que entró
  ws.send(
    JSON.stringify({
      type: "vehicleEnterSuccess",
      vehicleId,
      playerId: ws.id,
    })
  );

  // Notificar a todos los jugadores
  ws.publish(
    player.currentRoom,
    JSON.stringify({
      type: "vehicleEnter",
      vehicleId,
      playerId: ws.id,
      playerName: player.id,
    })
  );
};
