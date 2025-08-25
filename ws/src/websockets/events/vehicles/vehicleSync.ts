import type { IHandleParams } from "../../../types/types";
import { Room } from "../../../rooms/room";

export const vehicleSync = ({ server, ws, data, gameState }: IHandleParams) => {
  const room = gameState.rooms.main as Room;

  // console.log(`🔄 vehicleSync requested by ${ws.id}`);
  // console.log(`Room vehicles count: ${Object.keys(room.vehicles).length}`);

  const vehiclePositions = Object.entries(room.vehicles).map(
    ([id, vehicle]) => ({
      id,
      position: vehicle.position,
      rotation: vehicle.rotation,
      type: vehicle.type,
      color: vehicle.color,
      driverId: vehicle.driverId || null,
    })
  );

  // console.log(`📤 Sending ${vehiclePositions.length} vehicles to ${ws.id}:`,
  //   vehiclePositions.map(v => ({ id: v.id, pos: v.position })));

  ws.send(
    JSON.stringify({
      type: "vehicleSync",
      vehicles: vehiclePositions,
    })
  );
};
