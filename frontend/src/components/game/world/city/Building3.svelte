<script lang="ts">
  import {
    useDraco,
    useGltf,
    MeshLineMaterial,
    FakeGlowMaterial,
  } from "@threlte/extras";

  import { T } from "@threlte/core";
  import { items } from "#lib/utils/videoTexture";
  import { AutoColliders, Collider } from "@threlte/rapier";

  const gltf = useGltf("/city-transformed.glb", { dracoLoader: useDraco() });

  let physicsEnabled = $state(false);
  let playerNearBuilding = $state(false);

  const handleSensorEnter = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player entered Building3 sensor area");
      playerNearBuilding = true;
      physicsEnabled = true;
    }
  };

  const handleSensorExit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player exited Building3 sensor area");
      playerNearBuilding = false;
      physicsEnabled = false;
    }
  };
</script>

{#await gltf then gltf}
  <T.Group position={[-15.08, 10.22, -37.3]}>
    <!-- Sensor de proximidad para detectar al jugador -->
    <T.Group position={[0, -6, -2.5]}>
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
      <AutoColliders shape="convexHull">
        <T.Mesh
          geometry={gltf.nodes.edificio3_1.geometry}
          material={gltf.materials["Material.043"]}
        >
          <T.MeshBasicMaterial map={items[4].texture} toneMapped={false} />
        </T.Mesh>
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.edificio3_1.geometry}
        material={gltf.materials["Material.043"]}
      >
        <T.MeshBasicMaterial map={items[4].texture} toneMapped={false} />
      </T.Mesh>
    {/if}
    <T.Mesh
      geometry={gltf.nodes.edificio3_2.geometry}
      material={gltf.materials["Material.001"]}
    >
      <T.MeshBasicMaterial map={items[5].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.anuncio.geometry}
      material={gltf.materials["Material.001"]}
      position={[0.08, -6.27, 8.3]}
      rotation={[0, 0, Math.PI]}
    >
      <T.MeshBasicMaterial map={items[6].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.club_text.geometry}
      material={gltf.nodes.club_text.material}
      position={[0.24, -6.11, 8.4]}
    >
      <FakeGlowMaterial
        glowColor="cyan"
        falloff={1}
        glowInternalRadius={0.1}
        glowSharpness={5}
        depthTest={true}
      />
      <T.PointLight color="blue" position={[-2, 0, 2]} intensity={100} />
      <T.PointLight color="green" position={[2, 0, 2]} intensity={100} />
    </T.Mesh>
    <!-- Suelo - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.edificio3_ground.geometry}
          material={gltf.nodes.edificio3_ground.material}
          position={[0.08, -10.12, -2.7]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.edificio3_ground.geometry}
        material={gltf.nodes.edificio3_ground.material}
        position={[0.08, -10.12, -2.7]}
      />
    {/if}

    <!-- Banquetas - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.banquetas031.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[10.96, -10.12, -2.7]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas032.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[0.09, -10.12, 8.05]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas033.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[0.09, -10.12, -13.45]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas034.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-10.78, -10.12, -2.7]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.banquetas031.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[10.96, -10.12, -2.7]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas032.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[0.09, -10.12, 8.05]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas033.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[0.09, -10.12, -13.45]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas034.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-10.78, -10.12, -2.7]}
      />
    {/if}
  </T.Group>
{/await}
