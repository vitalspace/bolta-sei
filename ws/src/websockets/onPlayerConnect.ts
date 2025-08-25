import { randomUUIDv7 } from "bun";
import type {
  CustomWebSocket,
  IGameState,
  IPlayer,
  IRoom,
} from "../types/types";

export const onPlayerConnect = (ws: CustomWebSocket, gameState: IGameState) => {
  const { addPlayer, players } = gameState.rooms.main as IRoom;

  ws.id = randomUUIDv7();
  ws.subscribe("main");

  // Crear el player
  const player: IPlayer = {
    id: ws.id,
    position: { x: 0, y: 10, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
    health: 100,
    currentRoom: "main",
    isVip: false
    
  };

  addPlayer(player, ws);

  ws.send(JSON.stringify({ type: "playerId", playerId: ws.id }));

  ws.send(
    JSON.stringify({
      type: "currentPlayers",
      currentPlayers: players,
    })
  );

  ws.publish(
    "main",
    JSON.stringify({
      type: "newPlayer",
      player: players[ws.id],
    })
  );

  console.log(`Player ${ws.id} connected to main room`);
};
