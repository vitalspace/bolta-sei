<script lang="ts">
  const { position, rotation } = $props();

  import { T } from "@threlte/core";
  import { useDraco, useGltf } from "@threlte/extras";
  import { AutoColliders, Collider } from "@threlte/rapier";
  // import { isInShopInterior } from "../../../stores/shopStores";

  const gltf = useGltf("/city-transformed.glb", { dracoLoader: useDraco() });

  // Estado para controlar la física cuando el jugador está cerca
  let physicsEnabled = $state(false);

  const handleSensorEnter = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player entered house sensor area");
      physicsEnabled = true;
    }
  };

  const handleSensorExit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player exited house sensor area");
      physicsEnabled = false;
    }
  };
</script>

{#await gltf then gltf}
  <T.Group {position} {rotation}>
    <!-- Sensor de proximidad para detectar al jugador -->
    <T.Group position={[5, 0, 0]}>
      <Collider
        onsensorenter={handleSensorEnter}
        onsensorexit={handleSensorExit}
        sensor
        shape="cuboid"
        args={[12, 8, 12]}
      />
    </T.Group>

    {#if physicsEnabled}
      <AutoColliders shape="trimesh">
        <T.Mesh
          geometry={gltf.nodes.casa1_1.geometry}
          material={gltf.materials["Material.011"]}
        />

        <T.Mesh
          geometry={gltf.nodes.casa1_2.geometry}
          material={gltf.materials["Material.012"]}
        />
        <T.Mesh
          geometry={gltf.nodes.casa1_3.geometry}
          material={gltf.materials["Material.031"]}
        />
        <T.Mesh
          geometry={gltf.nodes.casa1_4.geometry}
          material={gltf.materials["Material.015"]}
        />
        <T.Mesh
          geometry={gltf.nodes.casa1_5.geometry}
          material={gltf.materials["Material.016"]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.casa1_1.geometry}
        material={gltf.materials["Material.011"]}
      />

      <T.Mesh
        geometry={gltf.nodes.casa1_2.geometry}
        material={gltf.materials["Material.012"]}
      />
      <T.Mesh
        geometry={gltf.nodes.casa1_3.geometry}
        material={gltf.materials["Material.031"]}
      />
      <T.Mesh
        geometry={gltf.nodes.casa1_4.geometry}
        material={gltf.materials["Material.015"]}
      />
      <T.Mesh
        geometry={gltf.nodes.casa1_5.geometry}
        material={gltf.materials["Material.016"]}
      />
    {/if}

    <T.Group position={[3.85, -0.71, 7.76]}>
      <T.Mesh
        geometry={gltf.nodes.arbol_casa_1_1.geometry}
        material={gltf.materials["Material.106"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arbol_casa_1_2.geometry}
        material={gltf.materials["Material.107"]}
      />
    </T.Group>
    {#if physicsEnabled}
      <T.Group position={[3.96, -3.56, 0.04]}>
        <AutoColliders shape="trimesh">
          <T.Mesh
            geometry={gltf.nodes.banqueta_casa_1_1.geometry}
            material={gltf.materials["FrontColor.001"]}
          />
          <T.Mesh
            geometry={gltf.nodes.banqueta_casa_1_2.geometry}
            material={gltf.materials["Material.031"]}
          />
        </AutoColliders>
      </T.Group>
      <T.Group position={[-0.97, -2.6, -3.62]}>
        <AutoColliders shape="cuboid">
          <T.Mesh
            geometry={gltf.nodes.basurero_casa_1_1.geometry}
            material={gltf.materials["Material.002"]}
          />
          <T.Mesh
            geometry={gltf.nodes.basurero_casa_1_2.geometry}
            material={gltf.materials["Material.018"]}
          />
        </AutoColliders>
      </T.Group>
    {:else}
      <T.Group position={[3.96, -3.56, 0.04]}>
        <T.Mesh
          geometry={gltf.nodes.banqueta_casa_1_1.geometry}
          material={gltf.materials["FrontColor.001"]}
        />
        <T.Mesh
          geometry={gltf.nodes.banqueta_casa_1_2.geometry}
          material={gltf.materials["Material.031"]}
        />
      </T.Group>
      <T.Group position={[-0.97, -2.6, -3.62]}>
        <T.Mesh
          geometry={gltf.nodes.basurero_casa_1_1.geometry}
          material={gltf.materials["Material.002"]}
        />
        <T.Mesh
          geometry={gltf.nodes.basurero_casa_1_2.geometry}
          material={gltf.materials["Material.018"]}
        />
      </T.Group>
    {/if}
  </T.Group>
{/await}
