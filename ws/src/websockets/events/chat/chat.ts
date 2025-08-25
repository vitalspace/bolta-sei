import { type IHandleParams } from "../../../types/types";

export const chat = ({ server, ws, data, gameState }: IHandleParams) => {
  const parsedData = typeof data === "string" ? JSON.parse(data) : data;

  const room = gameState.rooms[parsedData.roomId || "main"] as any;

  if (!room) return;

  server.publish(
    room.id,
    JSON.stringify({ type: "chat", id: ws.id, message: parsedData.message })
  );
};
