import type { Room } from "../rooms/room";
import { LocationType, type ILocation } from "../types/types";
import { RaceManager } from "../racing/RaceManager";

export class LocationLogicHandler {
  private static handlers: Record<
    LocationType,
    (location: ILocation, action: "activate" | "deactivate", room: Room) => void
  > = {
    [LocationType.RACING_TRACK]: this.handleRacingTrack,
    [LocationType.CLUB]: this.handleClub,
    [LocationType.MIAN_CITY]: this.handleMainCity,
    [LocationType.CHILL_ZONE]: this.handleChillZone,
  };

  static executeLogic(
    location: ILocation,
    action: "activate" | "deactivate",
    room: Room
  ): void {
    const handler = LocationLogicHandler.handlers[location.type];

    if (handler) {
      handler.call(LocationLogicHandler, location, action, room);
    } else {
      console.warn(`No handler found for location type: ${location.type}`);
    }
  }

  private static handleClub(
    location: ILocation,
    action: string,
    room: Room
  ): void {
    if (action === "activate") {
      // Activar música y efectos
      const clubData = {
        musicActive: true,
        lightEffects: true,
        volume: Math.min(location.currentPlayers.size * 0.2, 1.0),
      };

      location.specificData = { ...location.specificData, club: clubData };

      room.server?.publish(
        room.id,
        JSON.stringify({
          type: "club:activate",
          locationId: location.id,
          musicVolume: clubData.volume,
          effects: true,
        })
      );
    } else if (action === "deactivate") {
      // Fade out música
      room.server?.publish(
        room.id,
        JSON.stringify({
          type: "club:deactivate",
          locationId: location.id,
          fadeOut: true,
        })
      );

      if (location.specificData?.club) {
        delete location.specificData.club;
      }
    }
  }

  private static handleRacingTrack(
    location: ILocation,
    action: string,
    room: Room
  ): void {
    if (action === "activate" && location.currentPlayers.size >= 2) {
      // Delegar toda la lógica de carreras al RaceManager
      const success = RaceManager.activateRace(location, room);
      if (success) {
        console.log(
          `Race activated in ${location.id} with ${location.currentPlayers.size} players`
        );
      }
    } else if (action === "deactivate") {
      // Delegar la desactivación al RaceManager
      RaceManager.deactivateRace(location, room);
    }
  }

  private static handleMainCity(
    location: ILocation,
    action: string,
    room: Room
  ): void {
    // La ciudad principal no necesita lógica especial de activación/desactivación
    // Siempre está activa
  }

  private static handleChillZone(
    location: ILocation,
    action: "activate" | "deactivate",
    room: Room
  ): void {
    if (action === "activate") {
      // Activar juegos mecánicos
      const chillData = {
        mechanicalGames: true,
        ambientAnimations: true,
        interactiveElements: true,
      };

      location.specificData = { ...location.specificData, chill: chillData };

      room.server?.publish(
        room.id,
        JSON.stringify({
          type: "chill:activate",
          locationId: location.id,
          games: true,
          animations: true,
        })
      );
    } else if (action === "deactivate") {
      // Pausar animaciones gradualmente
      room.server?.publish(
        room.id,
        JSON.stringify({
          type: "chill:deactivate",
          locationId: location.id,
          pauseAnimations: true,
        })
      );

      if (location.specificData?.chill) {
        delete location.specificData.chill;
      }
    }
  }


}
