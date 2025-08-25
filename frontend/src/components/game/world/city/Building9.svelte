<script lang="ts">
  import { useDraco, useGltf } from "@threlte/extras";

  import { T } from "@threlte/core";

  import { AutoColliders, Collider } from "@threlte/rapier";

  const gltf = useGltf("/city-transformed.glb", { dracoLoader: useDraco() });

  let physicsEnabled = $state(false);

  const handleSensorEnter = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player entered Building9 sensor area");
      physicsEnabled = true;
    }
  };

  const handleSensorExit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player exited Building9 sensor area");
      physicsEnabled = false;
    }
  };
</script>

{#await gltf then gltf}
  <T.Group position={[94.61, 40, 39.27]}>
    <!-- Sensor de proximidad para detectar al jugador -->
    <T.Group position={[-1, -36, 1]}>
      <Collider
        onsensorenter={handleSensorEnter}
        onsensorexit={handleSensorExit}
        sensor
        shape="cuboid"
        args={[12, 4, 12]}
      />
    </T.Group>

    <!-- Banquetas - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.banquetas059.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-11.98, -39.9, 0.73]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas082.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-1.11, -39.9, 11.48]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas083.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-1.11, -39.9, -10.02]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas084.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[9.77, -39.9, 0.73]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.banquetas059.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-11.98, -39.9, 0.73]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas082.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-1.11, -39.9, 11.48]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas083.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-1.11, -39.9, -10.02]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas084.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[9.77, -39.9, 0.73]}
      />
    {/if}

    <!-- Edificio principal - solo collider activo cuando el jugador está cerca -->
    <T.Group position={[0, -22.89, 0]}>
      {#if physicsEnabled}
        <AutoColliders shape="trimesh">
          <T.Mesh
            geometry={gltf.nodes.edificio_9_1.geometry}
            material={gltf.materials["Material.002"]}
          />
          <T.Mesh
            geometry={gltf.nodes.edificio_9_2.geometry}
            material={gltf.materials["Material.008"]}
          />
        </AutoColliders>
      {:else}
        <T.Mesh
          geometry={gltf.nodes.edificio_9_1.geometry}
          material={gltf.materials["Material.002"]}
        />
        <T.Mesh
          geometry={gltf.nodes.edificio_9_2.geometry}
          material={gltf.materials["Material.008"]}
        />
      {/if}
    </T.Group>
  </T.Group>
{/await}
