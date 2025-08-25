import type { CustomWebSocket, IGameState, IRoom } from "../types/types";

export const onPlayerDisconnect = (
  ws: CustomWebSocket,
  gameState: IGameState
) => {
  const { removePlayer, players } = gameState.rooms.main as IRoom;

  // Verificar si el player existe antes de acceder a sus propiedades
  if (!players[ws.id]) {
    console.log(`Player ${ws.id} not found in gameState`);
    return;
  }

  const currentRoom = players[ws.id]?.currentRoom;

  if (!currentRoom) return;

  // Usar el método removePlayer de la room
  removePlayer(ws.id);

  // Remover player del estado global
  delete players[ws.id];

  // Desuscribir del canal
  ws.unsubscribe(currentRoom);

  ws.publish(
    currentRoom,
    JSON.stringify({ type: "playerList", players: Object.keys(players) })
  );

  ws.publish(
    currentRoom,
    JSON.stringify({ type: "playerDisconnected", playerId: ws.id })
  );

  console.log(`Player ${ws.id} disconnected from ${currentRoom} room`);
};
