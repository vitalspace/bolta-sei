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
      physicsEnabled = true;
    }
  };

  const handleSensorExit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player exited Building Bolta sensor area");
      physicsEnabled = false;
    }
  };
</script>

{#await gltf then gltf}
  <T.Group position={[53.02, 22.02, -0.05]}>
    <!-- Sensor de proximidad para detectar al jugador -->
    <T.Group position={[2, -19, 0]}>
      <Collider
        onsensorenter={handleSensorEnter}
        onsensorexit={handleSensorExit}
        sensor
        shape="cuboid"
        args={[22, 4, 22]}
      />
    </T.Group>

    <!-- Edificio principal - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="convexHull">
        <T.Mesh
          geometry={gltf.nodes.bolta_edificio_1.geometry}
          material={gltf.materials["Material.002"]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.bolta_edificio_1.geometry}
        material={gltf.materials["Material.002"]}
      />
    {/if}

    <T.Mesh
      geometry={gltf.nodes.bolta_edificio_2.geometry}
      material={gltf.materials["Material.001"]}
    />
    <T.Mesh
      geometry={gltf.nodes.antena1.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[-1.26, 7.24, -5.56]}
    />
    <T.Mesh
      geometry={gltf.nodes.antena2.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[5.21, 7.24, -5.57]}
    />
    <T.Mesh
      geometry={gltf.nodes.antena3.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[5.22, 7.24, 5.65]}
    />
    <T.Mesh
      geometry={gltf.nodes.antena4.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[-1.26, 7.24, 5.66]}
    />
    <T.Mesh
      geometry={gltf.nodes.bolta_text.geometry}
      material={gltf.nodes.bolta_text.material}
      position={[-4.24, -6.01, 0.17]}
    >
      <MeshLineMaterial
        color="white"
        linewidth={10}
        dashArray={2}
        dashRatio={1}
        dashOffset={0}
        transparent={false}
        depthTest={true}
      />
      <T.PointLight color="#6200ff" position={[-2, -2, 0]} intensity={100} />
      <T.PointLight color="yellow" position={[-2, -2, 0]} intensity={10} />
    </T.Mesh>
    <!-- Suelo - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.ground002.geometry}
          material={gltf.materials["Material.001"]}
          position={[1.98, -21.82, 0.05]}
          scale={[20, 0.1, 20]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.ground002.geometry}
        material={gltf.materials["Material.001"]}
        position={[1.98, -21.82, 0.05]}
        scale={[20, 0.1, 20]}
      />
    {/if}
    <T.Mesh
      geometry={gltf.nodes.light_front.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[-3.81, 2.13, 0.11]}
    >
      <MeshLineMaterial
        color="#6200ff"
        linewidth={10}
        dashArray={2}
        dashRatio={1}
        dashOffset={0}
        transparent={false}
        depthTest={true}
      />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.side_light.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[2.27, -2.53, 0.05]}
    >
      <FakeGlowMaterial
        glowColor="blue"
        falloff={1}
        glowInternalRadius={0.1}
        glowSharpness={5}
        depthTest={true}
      />
    </T.Mesh>
    <!-- Terraza - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="trimesh">
        <T.Mesh
          geometry={gltf.nodes.trerraza001.geometry}
          material={gltf.nodes.trerraza001.material}
          position={[1.98, -18.6, 0.05]}
        >
          <FakeGlowMaterial
            glowColor="#c2044a"
            falloff={1}
            glowInternalRadius={0.1}
            glowSharpness={5}
            depthTest={true}
          />
        </T.Mesh>
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.trerraza001.geometry}
        material={gltf.nodes.trerraza001.material}
        position={[1.98, -18.6, 0.05]}
      >
        <MeshLineMaterial
          color="black"
          linewidth={10}
          dashArray={2}
          dashRatio={1}
          dashOffset={0}
          transparent={false}
          depthTest={true}
        />
      </T.Mesh>
    {/if}

    <!-- Banquetas - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.banquetas023.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-18.89, -21.92, 0.05]}
        />
      </AutoColliders>
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.banquetas024.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[1.98, -21.92, -20.7]}
        />
      </AutoColliders>
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.banquetas025.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[1.98, -21.92, 20.8]}
        />
      </AutoColliders>
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.banquetas026.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[22.86, -21.92, 0.05]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.banquetas023.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-18.89, -21.92, 0.05]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas024.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[1.98, -21.92, -20.7]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas025.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[1.98, -21.92, 20.8]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas026.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[22.86, -21.92, 0.05]}
      />
    {/if}
  </T.Group>
{/await}
