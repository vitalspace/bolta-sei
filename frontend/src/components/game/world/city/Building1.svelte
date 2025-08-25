<script lang="ts">
  import {
    useDraco,
    useGltf,
    MeshLineMaterial,
    FakeGlowMaterial,
  } from "@threlte/extras";

  import { T } from "@threlte/core";
  import { AutoColliders, Collider } from "@threlte/rapier";

  const gltf = useGltf("/city-transformed.glb", { dracoLoader: useDraco() });

  let physicsEnabled = $state(false);
  let playerNearBuilding = $state(false);

  const handleSensorEnter = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player entered Building1 sensor area");
      playerNearBuilding = true;
      physicsEnabled = true;
    }
  };

  const handleSensorExit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player exited Building1 sensor area");
      playerNearBuilding = false;
      physicsEnabled = false;
    }
  };
</script>

{#await gltf then gltf}
  <T.Group position={[-96.12, 17.1, -39.27]}>
    <!-- Sensor de proximidad para detectar al jugador -->
    <T.Group position={[1, -13, -0.8]}>
      <Collider
        onsensorenter={handleSensorEnter}
        onsensorexit={handleSensorExit}
        sensor
        shape="cuboid"
        args={[12, 4, 12]}
      />
    </T.Group>

    <!-- Edificio principal - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="trimesh">
        <T.Mesh
          geometry={gltf.nodes.edificio1_1.geometry}
          material={gltf.materials["Material.002"]}
        />
        <T.Mesh
          geometry={gltf.nodes.edificio1_2.geometry}
          material={gltf.materials["Material.008"]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.edificio1_1.geometry}
        material={gltf.materials["Material.002"]}
      />
      <T.Mesh
        geometry={gltf.nodes.edificio1_2.geometry}
        material={gltf.materials["Material.008"]}
      />
    {/if}
    <T.Mesh
      geometry={gltf.nodes.anuncio001.geometry}
      material={gltf.materials["Material.002"]}
    />
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.banquetas035.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[1.13, -17, 10.02]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas036.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[1.13, -17, -11.48]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas037.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[12, -17, -0.73]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas038.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-9.75, -17, -0.73]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.banquetas035.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[1.13, -17, 10.02]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas036.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[1.13, -17, -11.48]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas037.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[12, -17, -0.73]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas038.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-9.75, -17, -0.73]}
      />
    {/if}
  </T.Group>
{/await}
