import type { IHandleParams } from "../../../types/types";
import { Room } from "../../../rooms/room";

export const vehicleExit = ({ server, ws, data, gameState }: IHandleParams) => {
  const room = gameState.rooms.main as Room;
  const { players, vehicles } = room;
  const player = players[ws.id];

  if (!player) return;

  //@ts-ignore
  const vehicleId = data.vehicleId;
  const vehicle = vehicles[vehicleId];

  if (!vehicle || vehicle.driverId !== ws.id) {
    return; // El jugador no está autorizado a salir de este vehículo
  }

  // Liberar el vehículo
  vehicle.driverId = null;

  // IMPORTANTE: También limpiar en el vehículo físico usando la nueva arquitectura Room
  room.setVehicleDriver(vehicleId, null);
  console.log(`🚗 Player ${ws.id} exited vehicle ${vehicleId}`);

  // Confirmar salida al jugador que salió
  ws.send(
    JSON.stringify({
      type: "vehicleExitSuccess",
      vehicleId,
      playerId: ws.id,
      //@ts-ignore
      exitPosition: data.exitPosition,
    })
  );

  // Notificar a todos los jugadores
  ws.publish(
    player.currentRoom,
    JSON.stringify({
      type: "vehicleExit",
      vehicleId,
      playerId: ws.id,
      //@ts-ignore
      exitPosition: data.exitPosition,
    })
  );
};
