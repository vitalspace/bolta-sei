<script lang="ts">
  import { useDraco, useGltf } from "@threlte/extras";

  import { items } from "#lib/utils/videoTexture";
  import { T } from "@threlte/core";
  import { AutoColliders, Collider } from "@threlte/rapier";
  const gltf = useGltf("/city-transformed.glb", { dracoLoader: useDraco() });

  let physicsEnabled = $state(false);

  const handleSensorEnter = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player entered Building6 sensor area");
      physicsEnabled = true;
    }
  };

  const handleSensorExit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player exited Building6 sensor area");
      physicsEnabled = false;
    }
  };
</script>

{#await gltf then gltf}
  <T.Group position={[93.7, 15, -40]}>
    <!-- Sensor de proximidad para detectar al jugador -->
    <T.Group position={[-0.1, -11, 0]}>
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
          geometry={gltf.nodes.banquetas045.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-0.19, -14.9, 10.75]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas046.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[10.68, -14.9, 0]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas047.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-11.06, -14.9, 0]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas048.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-0.19, -14.9, -10.75]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.banquetas045.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-0.19, -14.9, 10.75]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas046.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[10.68, -14.9, 0]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas047.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-11.06, -14.9, 0]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas048.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-0.19, -14.9, -10.75]}
      />
    {/if}

    <!-- Edificio principal - solo collider activo cuando el jugador está cerca -->
    <T.Group position={[0, -8.44, 0]}>
      {#if physicsEnabled}
        <AutoColliders shape="trimesh">
          <T.Mesh
            geometry={gltf.nodes.edificio6_1.geometry}
            material={gltf.materials["Material.081"]}
          />
          <T.Mesh
            geometry={gltf.nodes.edificio6_2.geometry}
            material={gltf.materials["Material.082"]}
          >
            <T.MeshBasicMaterial map={items[9].texture} toneMapped={false} />
          </T.Mesh>
          <T.Mesh
            geometry={gltf.nodes.edificio6_3.geometry}
            material={gltf.materials["Material.019"]}
          />
        </AutoColliders>
      {:else}
        <T.Mesh
          geometry={gltf.nodes.edificio6_1.geometry}
          material={gltf.materials["Material.081"]}
        />
        <T.Mesh
          geometry={gltf.nodes.edificio6_2.geometry}
          material={gltf.materials["Material.082"]}
        >
          <T.MeshBasicMaterial map={items[9].texture} toneMapped={false} />
        </T.Mesh>
        <T.Mesh
          geometry={gltf.nodes.edificio6_3.geometry}
          material={gltf.materials["Material.019"]}
        />
      {/if}
    </T.Group>
  </T.Group>
{/await}
