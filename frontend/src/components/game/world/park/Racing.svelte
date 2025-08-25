<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { FakeGlowMaterial, HTML } from "@threlte/extras";
  import { AutoColliders } from "@threlte/rapier";
  import { gameState, keys } from "../../../stores/gameStore";
  import { hideHtmlElements } from "../../../stores/stores";
  import { type WebSocketMessage } from "../../../types/ws";
  import { wsService } from "../../../webSockets/webSockets";
  import CheckPoint from "../Racing/CheckPoints.svelte";

  import { timeLeft } from "../../../stores/timeLeft";

  const { messages } = wsService;

  let playerId = $state();
  let isOnCheckPoint = $state(false);
  let locationId = $state<string>();

  let checkpoints = $state([]);

  const onsensorenter = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player") {
      isOnCheckPoint = true;
      playerId = userData.id;
    }
  };
  const onsensorexit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player") {
      isOnCheckPoint = false;
      playerId = undefined;
    }
  };

  useTask(() => {
    if (isOnCheckPoint && $keys.e.isPressed) {
      wsService.send({
        type: "location:enter",
        playerId: playerId,
        locationId: "racing_track",
      });
    }
  });

  messages.subscribe((message: WebSocketMessage | null) => {
    if (!message?.type) return;

    switch (message.type) {
      case "race:countdown": {
        console.log(message);
        $timeLeft.message = "Race starts in";
        $timeLeft.time = message.countdown;
        break;
      }

      case "race:start": {
        $gameState.player.canMove = true;
        checkpoints = message.checkpoints;
        locationId = message.locationId;
        break;
      }
    }

    // if (message.type === "race:countdown") {
    //   console.log(message)
    // }
  });
</script>

{#each checkpoints as checkpoint}
  <CheckPoint ws={wsService} {locationId} checkPointData={checkpoint} />
{/each}

<T.Group position={[-9, 0.7, -17.2]}>
  {#if !$hideHtmlElements}
    <HTML transform position={[0, 1, 0]} rotation={[0, Math.PI / 4, 0]}>
      <div class="">
        <h2 class="text-white text-sm">Press E</h2>
      </div>
    </HTML>
  {/if}

  <AutoColliders sensor shape="cuboid" {onsensorenter} {onsensorexit}>
    <T.Mesh>
      <T.CylinderGeometry args={[1.5, 1.5, 1, 32]} />
      <!-- <T.MeshBasicMaterial color="red" transparent opacity={0.5} /> -->
      <FakeGlowMaterial
        glowColor="#3a1994"
        falloff={1}
        glowInternalRadius={0.1}
        glowSharpness={5}
        depthTest={true}
      />
    </T.Mesh>
  </AutoColliders>
</T.Group>
