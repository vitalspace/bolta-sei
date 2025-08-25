<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { showShop } from "#stores/shopStore";
  import { AutoColliders } from "@threlte/rapier";
  import { HTML } from "@threlte/extras";
  import { keys } from "#stores/gameStore.ts";
  import { showHtmlElements } from "#stores/stores";

  let isOnCheckPoint = $state(false);

  const handleSensorEnter = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    console.log("userData", userData);

    if (userData?.name === "player") {
      isOnCheckPoint = true;
    }
  };

  const handleSensorExit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player") {
    //   showShop.set(false);
      isOnCheckPoint = false;
      showHtmlElements.set(true);
    }
  };

  useTask(() => {
    if (isOnCheckPoint && $keys.e.isPressed) {
      showShop.set(true);
      showHtmlElements.set(false);
      console.log("showing shop");
    }
  });
</script>

<T.Group position={[-15.19, 0.7, 44]}>
  {#if $showHtmlElements}
    <HTML transform position={[0, 1, 0]} rotation={[0, Math.PI, 0]}>
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
      <T.CylinderGeometry args={[1, 1, 1, 32]} />
      <T.MeshStandardMaterial transparent opacity={0.6} color="#6200ff" />
    </T.Mesh>
  </AutoColliders>
</T.Group>
