<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { PerspectiveCamera, Vector3 } from "three";
  import { keys, gameState } from "#stores/gameStore";
  import { AudioListener } from "@threlte/extras";

  import GameController from "../gameController/gameController.svelte";

  let cameraRef: PerspectiveCamera | undefined = $state<PerspectiveCamera>();

  const handleKeysPress = (e: KeyboardEvent, isDown: boolean) => {
    // Don't prevent default if user is typing in an input field
    const activeElement = document.activeElement;
    const isInputActive =
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        //@ts-ignore
        activeElement.contentEditable === "true");

    if (isInputActive) return; // Don't handle game controls when typing

    e.preventDefault();

    const { keyCode } = e;

    keys.update(($keys) => {
      switch (keyCode) {
        case 65:
          $keys.a.isPressed = isDown;
          break;
        case 68:
          $keys.d.isPressed = isDown;
          break;
        case 87:
          $keys.w.isPressed = isDown;
          break;
        case 83:
          $keys.s.isPressed = isDown;
          break;
        case 32:
          $keys.space.isPressed = isDown;
          break;
        case 16:
          $keys.shift.isPressed = isDown;
          break;
        case 69:
          $keys.e.isPressed = isDown;
          break;
      }
      return $keys;
    });
  };

  // Manejo centralizado de mouse
  const handleMouseMove = (e: MouseEvent) => {
    if (document.pointerLockElement) {
      const currentControls = getCurrentControls();

      if (currentControls) {
        if ($gameState.controlMode === "player") {
          currentControls.update(e.movementX, e.movementY);
        } else if ($gameState.controlMode === "vehicle") {
          // Sensibilidad normal para vehículos, no multiplicar
          currentControls.update(e.movementX, e.movementY);
        }
      }
    }
  };

  const handleCanvasClick = () => {
    const canvas = document.querySelector("canvas");
    if (canvas && document.pointerLockElement !== canvas) {
      canvas.requestPointerLock();
    }
  };

  const getCurrentControls = () => {
    if ($gameState.controlMode === "player") {
      const playerControls = $gameState.controls.player;
      if (!playerControls) {
        console.log("⚠️ No player controls found!");
        console.log("Game state controls:", $gameState.controls);
      } else {
        // Debug: confirmar que tenemos controles del jugador (solo ocasionalmente)
        if (Math.random() < 0.005) {
          // console.log("🎮 Using player controls");
        }
      }
      return playerControls;
    } else if (
      $gameState.controlMode === "vehicle" &&
      $gameState.player.currentVehicle
    ) {
      const vehicleControls = $gameState.controls.vehicles.get(
        $gameState.player.currentVehicle
      );
      if (!vehicleControls) {
        // No vehicle controls found
      }
      return vehicleControls;
    }
    return null;
  };

  $effect(() => {
    document.addEventListener("keydown", (e) => handleKeysPress(e, true));
    document.addEventListener("keyup", (e) => handleKeysPress(e, false));

    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("click", handleCanvasClick);
      canvas.addEventListener("pointermove", handleMouseMove);
    }

    return () => {
      document.removeEventListener("keydown", (e) => handleKeysPress(e, true));
      document.removeEventListener("keyup", (e) => handleKeysPress(e, false));

      if (canvas) {
        canvas.removeEventListener("click", handleCanvasClick);
        canvas.removeEventListener("pointermove", handleMouseMove);
      }
    };
  });
</script>

<T.PerspectiveCamera makeDefault bind:ref={cameraRef}>
  <AudioListener />
</T.PerspectiveCamera>

<!-- {#if $status === "open"}
  <Player {cameraRef} />
{/if} -->
<!-- Controlador de juego que maneja jugadores y vehículos -->
<GameController {cameraRef} />
