import { serve } from "bun";
import { gameState } from "./gameState/gameState";

import type { CustomWebSocket } from "./types/types";
import { onPlayerConnect } from "./websockets/onPlayerConnect";
import { onPlayerDisconnect } from "./websockets/onPlayerDisconnect";
import { onMessages } from "./websockets/onMessages";

let server: ReturnType<typeof serve>;

server = serve({
  port: 4000,
  fetch(request: Request) {
    const { url, method } = request;
    const { pathname } = new URL(url);

    if (method === "GET" && pathname === "/v2/ws") {
      if (server.upgrade(request)) return;
      return new Response("Not Found", { status: 404 });
    }

    return new Response("Not Found", { status: 404 });
  },

  websocket: {
    open(ws: CustomWebSocket) {
      onPlayerConnect(ws, gameState);
    },
    message(ws: CustomWebSocket, message: string) {
      onMessages(server, ws, message, gameState);
    },
    close(ws: CustomWebSocket) {
      onPlayerDisconnect(ws, gameState);
    },
    drain(ws) {},
  },
});

// Configure server for broadcasting in all rooms
gameState.setServer(server);

console.log("Server started on port 4000");
