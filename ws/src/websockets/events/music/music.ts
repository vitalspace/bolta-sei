import { type IHandleParams } from "../../../types/types";
import { getSong, cleanUrl } from "../../../utils/getSong";

export const music = async ({ server, ws, data, gameState }: IHandleParams) => {
  const parsedData = typeof data === "string" ? JSON.parse(data) : data;

  const room = gameState.rooms[parsedData.roomId || "main"] as any;

  if (!room) return;

  const id = cleanUrl(parsedData.url);

  if (!id) return;

  const song = await getSong(id);

  if (!song) return;

  server.publish(
    "main",
    JSON.stringify({ type: "music", id: ws.id, song: song })
  );
};
