<script lang="ts">
  import { wsService } from "#websockets/websockets";
  import RemotePlayer from "../players/Player.svelte";
  import Player from "../player/Player.svelte";
  import Car from "../car/Car4.svelte";
  import { gameState } from "#stores/gameStore";
  import { type WebSocketMessage } from "#types/ws";

  let player = $state();

  interface Vehicle {
    id: string;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number; w: number };
    driverId?: string | null;
    type: string;
    color: string;
  }

  let { cameraRef } = $props();

  const { status, messages } = wsService;

  let players = $state<Map<string, any>>(new Map());
  let vehicles = $state<Map<string, Vehicle>>(new Map<string, Vehicle>());

  let playerId = $state<string>();

  messages.subscribe((msg: WebSocketMessage | null) => {
    if (!msg?.type) return;

    switch (msg.type) {
      case "playerId": {
        playerId = (msg as any).playerId;
        break;
      }

      case "currentPlayers": {
        const currentPlayersMsg = msg as any;

        // Clear existing players and add current ones
        players.clear();

        Object.keys(currentPlayersMsg.currentPlayers).forEach((_id) => {
          // Skip own player
          if (_id === playerId) {
            player = currentPlayersMsg.currentPlayers[_id];
          } else {
            players.set(_id, currentPlayersMsg.currentPlayers[_id]);
          }
        });

        // Trigger reactivity
        players = new Map(players);
        break;
      }

      case "playerLocation": {
        const playerLocationMsg = msg as any;
        const existingPlayer = players.get(playerLocationMsg.player.id);
        if (existingPlayer) {
          existingPlayer.position = playerLocationMsg.player.position;
          existingPlayer.rotation = playerLocationMsg.player.rotation;

          // Actualizar animación si está presente
          if (playerLocationMsg.player.animation) {
            existingPlayer.animation = playerLocationMsg.player.animation;
          }

          // Trigger reactivity
          players = new Map(players);
        }
        break;
      }

      case "newPlayer": {
        const newPlayerMsg = msg as any;
        // Only add if not already exists and not own player
        if (
          !players.has(newPlayerMsg.player.id) &&
          newPlayerMsg.player.id !== playerId
        ) {
          // Asegurar que el nuevo jugador tenga animación por defecto
          const newPlayer = {
            ...newPlayerMsg.player,
            animation: newPlayerMsg.player.animation || {
              current: "Idle",
              changed: true,
              timestamp: Date.now(),
            },
          };
          players.set(newPlayerMsg.player.id, newPlayer);
          players = new Map(players);
        }
        break;
      }

      case "playerDisconnected": {
        const disconnectedMsg = msg as any;
        if (players.has(disconnectedMsg.playerId)) {
          players.delete(disconnectedMsg.playerId);
          players = new Map(players);
        }
        break;
      }

      case "vehiclePositions": {
        const vehiclePositionsMsg = msg as any;
        // console.log("🚗 Received vehiclePositions:", vehiclePositionsMsg);

        if (
          vehiclePositionsMsg.vehicles &&
          Array.isArray(vehiclePositionsMsg.vehicles)
        ) {
          // Actualizar vehículos existentes sin recrear el Map
          vehiclePositionsMsg.vehicles.forEach((vehicleData: any) => {
            const existing = vehicles.get(vehicleData.id);
            if (existing) {
              // Estos vehículos NO tienen conductor, actualizar posición libremente
              existing.position = vehicleData.position;
              existing.rotation = vehicleData.rotation;
              existing.driverId = vehicleData.driverId; // Debería ser null
              existing.color = vehicleData.color;
              // console.log(`📍 Updated vehicle ${vehicleData.id} position:`, vehicleData.position);
            } else {
              // Agregar nuevo vehículo
              vehicles.set(vehicleData.id, vehicleData);
              // console.log(`➕ Added new vehicle ${vehicleData.id}`);
            }
          });
          // Trigger reactivity
          vehicles = new Map(vehicles);
        }
        break;
      }

      case "vehicleDriverStatus": {
        const driverStatusMsg = msg as any;
        if (
          driverStatusMsg.vehicles &&
          Array.isArray(driverStatusMsg.vehicles)
        ) {
          // Solo actualizar el estado del conductor, NO la posición
          driverStatusMsg.vehicles.forEach((vehicleData: any) => {
            const existing = vehicles.get(vehicleData.id);
            if (existing) {
              existing.driverId = vehicleData.driverId;
            }
          });
          // Trigger reactivity
          vehicles = new Map(vehicles);
        }
        break;
      }

      case "vehicleSync": {
        const vehicleSyncMsg = msg as any;
        // console.log("🔄 Received vehicleSync:", vehicleSyncMsg);
        if (vehicleSyncMsg.vehicles && Array.isArray(vehicleSyncMsg.vehicles)) {
          // console.log(`📥 Syncing ${vehicleSyncMsg.vehicles.length} vehicles`);
          // Solo para sincronización inicial - limpiar y recrear
          vehicles.clear();
          vehicleSyncMsg.vehicles.forEach((vehicleData: any) => {
            vehicles.set(vehicleData.id, vehicleData);
            // console.log(
            //   `➕ Added vehicle ${vehicleData.id} at position:`,
            //   vehicleData.position
            // );
          });
          vehicles = new Map(vehicles);
          // console.log(
          //   `✅ Vehicle sync complete. Total vehicles: ${vehicles.size}`
          // );
        } else {
          console.log("⚠️ vehicleSync message has no vehicles array");
        }
        break;
      }

      case "vehicleEnterSuccess": {
        const enterSuccessMsg = msg as any;
        $gameState.controlMode = "vehicle";
        $gameState.player = {
          ...$gameState.player,
          isInVehicle: true,
          currentVehicle: enterSuccessMsg.vehicleId,
          isVisible: false,
        };
        break;
      }

      case "vehicleExitSuccess": {
        const exitSuccessMsg = msg as any;
        // Confirmación de salida exitosa del vehículo
        // El manejo específico se hace en el componente Car4
        break;
      }

      case "vehicleUpdate": {
        const vehicleUpdateMsg = msg as any;
        // Actualización individual de vehículo (prioridad sobre vehiclePositions)
        const vehicle = vehicles.get(vehicleUpdateMsg.vehicleId);
        if (vehicle) {
          vehicle.position = vehicleUpdateMsg.position;
          vehicle.rotation = vehicleUpdateMsg.rotation;
          vehicle.driverId = vehicleUpdateMsg.driverId;
          // Trigger reactivity
          vehicles = new Map(vehicles);
        }
        break;
      }

      case "isVip": {
        const plyerid = msg.id;

        if (!players.has(plyerid)) return;

        players.get(plyerid).isVip = true;

        break;
      }
    }
  });

  $effect(() => {
    if ($status === "open") {
      // console.log("🔌 WebSocket connected, requesting vehicleSync...");
      wsService.send({
        type: "vehicleSync",
      });
    }
  });

  // Convert Maps to arrays for iteration
  const playersArray = $derived(Array.from(players.values()));
</script>

{#if $status === "open"}
  {#if player}
    <Player playerInfo={player} {cameraRef} />
  {/if}

  {#if playersArray.length > 0}
    {#each playersArray as player (player.id)}
      <RemotePlayer playerInfo={player} />
    {/each}
  {/if}

  <!-- Renderizado simple y directo -->
  {#each Array.from(vehicles.values()) as vehicle (vehicle.id)}
    <Car carInfo={vehicle} {cameraRef} />
  {/each}
{/if}
