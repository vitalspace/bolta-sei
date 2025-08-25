import type { IHandleParams, IRoom } from "../../../types/types";

export const vip = ({ server, ws, data, gameState }: IHandleParams) => {
  const parsedData = typeof data === "string" ? JSON.parse(data) : data;
  const { players } = gameState.rooms.main as IRoom;

  const player = players[ws.id];

  if (!player) return;

  player.isVip = parsedData.isVip;
  
  server.publish(
    player.currentRoom,
    JSON.stringify({ type: "isVip", id: ws.id, isVip: parsedData.isVip })
  );

  //   server.publish(player.currentRoom, JSON.stringify({ type: "isVip", player }));

  //   if (!player) return;

  //   //@ts-ignore
  //   player.position = data.position;

  //   //@ts-ignore
  //   player.rotation = data.rotation;

  //   // Actualizar animación si cambió
  //   //@ts-ignore
  //   if (data.animation) {
  //     //@ts-ignore
  //     player.animation = {
  //       //@ts-ignore
  //       current: data.animation.current,
  //       //@ts-ignore
  //       changed: data.animation.changed,
  //       timestamp: Date.now(),
  //     };
  //   }

  //   ws.publish(
  //     player.currentRoom,
  //     JSON.stringify({ type: "playerLocation", player })
  //   );
};
