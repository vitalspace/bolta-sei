<script lang="ts">
  import {
    currentSongUrl,
    hideHtmlElements,
    showYouTubeDialog,
  } from "#stores/parkStores";
  import { T, useTask } from "@threlte/core";
  import { HTML, PositionalAudio } from "@threlte/extras";
  import { AutoColliders } from "@threlte/rapier";

  import { keys } from "#stores/gameStore";

  let isOnCheckPoint = $state(false);

  const handleSensorEnter = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player") {
      isOnCheckPoint = true;
    }
  };

  const handleSensorExit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player") {
      isOnCheckPoint = false;
      $keys.e.isPressed = false;
    }
  };

  let ePressed = $state(false);

  useTask(() => {
    if (isOnCheckPoint && $keys.e.isPressed && !ePressed) {
      ePressed = true;
      showYouTubeDialog.set(true);
    } else if (!$keys.e.isPressed) {
      ePressed = false;
    }
  });
</script>

<T.Group name="player" position={[22.8, -11, 0]}>
  {#if !$hideHtmlElements}
    <HTML transform position={[0, 1, 0]} rotation={[0, Math.PI * 1.5, 0]}>
      <div class="">
        <h2 class="text-white text-sm">Press E</h2>
      </div>
    </HTML>
  {/if}

  <AutoColliders
    sensor
    shape="cuboid"
    onsensorenter={handleSensorEnter}
    onsensorexit={handleSensorExit}
  >
    <T.Mesh>
      <T.BoxGeometry args={[1, 1, 2]} />
      <T.MeshBasicMaterial color="#6200ff" transparent opacity={0} />
    </T.Mesh>
  </AutoColliders>
</T.Group>

{#if $currentSongUrl}
  <T.Group position={[20.5, 0.3, 0.1]}>
    <PositionalAudio autoplay src={$currentSongUrl} refDistance={2} />
  </T.Group>
{/if}
