import type { IHandleParams } from "../../../types/types";
import { RaceManager } from "../../../racing/RaceManager";

export const locationEnter = ({ ws, data, gameState }: IHandleParams) => {
  const parsedData = typeof data === "string" ? JSON.parse(data) : data;
  const room = gameState.rooms[parsedData.roomId || "main"] as any; // Cast para evitar problemas de tipos

  if (!room) return;

  console.log(parsedData);

  ws.send(
    JSON.stringify({
      type: "player:spawn",
      position: parsedData.position,
      locationId: parsedData.locationId,
    })
  );

  // if (!room) {
  //   ws.send(
  //     JSON.stringify({
  //       type: "location:enter_response",
  //       success: false,
  //       error: "Room not found",
  //     })
  //   );
  //   return;
  // }

  // const success = room.locationManager.movePlayerToLocation(
  //   parsedData.playerId,
  //   parsedData.locationId
  // );

  // // Si el movimiento fue exitoso, asignar posición de spawn
  // if (success) {
  //   const location = room.locations[parsedData.locationId];
  //   const player = room.players[parsedData.playerId];

  //   if (location && player && location.spawnPoints.length > 0) {
  //     // Seleccionar un spawn point aleatorio o el primero disponible
  //     const spawnPoint = location.spawnPoints[0];
  //     player.position = { x: spawnPoint.x, y: spawnPoint.y, z: spawnPoint.z };

  //     // Notificar al cliente sobre la nueva posición
  //     ws.send(
  //       JSON.stringify({
  //         type: "player:spawn",
  //         position: player.position,
  //         locationId: parsedData.locationId,
  //       })
  //     );
  //   }

  //   if (parsedData.vehicleId) {
  //     room.moveVehicleToLocation(parsedData.vehicleId, parsedData.locationId);
  //   }
  // }

  // ws.send(
  //   JSON.stringify({
  //     type: "location:enter_response",
  //     success,
  //     locationId: parsedData.locationId,
  //     playerId: parsedData.playerId,
  //   })
  // );
};

export const locationExit = ({ ws, data, gameState }: IHandleParams) => {
  const parsedData = typeof data === "string" ? JSON.parse(data) : data;
  const room = gameState.rooms[parsedData.roomId || "main"] as any;

  if (!room) {
    ws.send(
      JSON.stringify({
        type: "location:exit_response",
        success: false,
        error: "Room not found",
      })
    );
    return;
  }

  room.locationManager.removePlayerFromLocation(
    parsedData.playerId,
    parsedData.locationId
  );

  ws.send(
    JSON.stringify({
      type: "location:exit_response",
      success: true,
      playerId: parsedData.playerId,
    })
  );
};

export const locationStateRequest = ({
  ws,
  data,
  gameState,
}: IHandleParams) => {
  const parsedData = typeof data === "string" ? JSON.parse(data) : data;
  const room = gameState.rooms[parsedData.roomId || "main"] as any;

  if (!room) {
    ws.send(
      JSON.stringify({
        type: "location:state_response",
        success: false,
        error: "Room not found",
      })
    );
    return;
  }

  if (parsedData.locationId) {
    // Estado de una locación específica
    const locationState = room.locationManager.getLocationState(
      parsedData.locationId
    );
    ws.send(
      JSON.stringify({
        type: "location:state_response",
        success: true,
        location: locationState,
      })
    );
  } else {
    // Estado de todas las locaciones
    const allLocations = room.locationManager.getAllLocationsState();
    ws.send(
      JSON.stringify({
        type: "location:state_response",
        success: true,
        locations: allLocations,
      })
    );
  }
};

export const locationTeleport = ({ ws, data, gameState }: IHandleParams) => {
  const parsedData = typeof data === "string" ? JSON.parse(data) : data;
  const room = gameState.rooms[parsedData.roomId || "main"] as any;

  if (!room) {
    ws.send(
      JSON.stringify({
        type: "location:teleport_response",
        success: false,
        error: "Room not found",
      })
    );
    return;
  }

  const success = room.locationManager.movePlayerToLocation(
    parsedData.playerId,
    parsedData.targetLocationId
  );

  // Si el teleport fue exitoso, notificar la nueva posición
  if (success) {
    const player = room.players[parsedData.playerId];
    if (player) {
      // Notificar al cliente sobre la nueva posición
      ws.send(
        JSON.stringify({
          type: "player:teleport",
          position: player.position,
          locationId: parsedData.targetLocationId,
        })
      );

      // Broadcast la nueva posición a otros jugadores
      ws.publish(
        player.currentRoom,
        JSON.stringify({
          type: "playerLocation",
          player: {
            id: player.id,
            position: player.position,
            rotation: player.rotation,
          },
        })
      );
    }

    if (parsedData.vehicleId) {
      room.moveVehicleToLocation(
        parsedData.vehicleId,
        parsedData.targetLocationId
      );
    }
  }

  ws.send(
    JSON.stringify({
      type: "location:teleport_response",
      success,
      targetLocationId: parsedData.targetLocationId,
      playerId: parsedData.playerId,
    })
  );
};
export const raceCheckpointCrossed = ({
  ws,
  data,
  gameState,
}: IHandleParams) => {
  const parsedData = typeof data === "string" ? JSON.parse(data) : data;
  const room = gameState.rooms[parsedData.roomId || "main"] as any;

  console.log("CHECK POINT", parsedData);

  if (!room) {
    ws.send(
      JSON.stringify({
        type: "race:checkpoint_response",
        success: false,
        error: "Room not found",
      })
    );
    return;
  }

  const location = room.locations[parsedData.locationId];
  if (!location) {
    ws.send(
      JSON.stringify({
        type: "race:checkpoint_response",
        success: false,
        error: "Location not found",
      })
    );
    return;
  }

  // Handle checkpoint crossing usando RaceManager
  RaceManager.handleCheckpointCrossing(
    location,
    room,
    parsedData.playerId,
    parsedData.checkpointId
  );

  ws.send(
    JSON.stringify({
      type: "race:checkpoint_response",
      success: true,
      playerId: parsedData.playerId,
      checkpointId: parsedData.checkpointId,
    })
  );
};
