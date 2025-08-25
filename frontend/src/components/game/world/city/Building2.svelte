<script lang="ts">
  import {
    useDraco,
    useGltf,
    MeshLineMaterial,
    FakeGlowMaterial,
  } from "@threlte/extras";

  import { T } from "@threlte/core";
  import { items } from "#lib/utils/imagenTexture";

  import { AutoColliders, Collider } from "@threlte/rapier";

  const gltf = useGltf("/city-transformed.glb", { dracoLoader: useDraco() });

  let physicsEnabled = $state(false);
  let playerNearBuilding = $state(false);

  const handleSensorEnter = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player entered Building2 sensor area");
      playerNearBuilding = true;
      physicsEnabled = true;
    }
  };

  const handleSensorExit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player exited Building2 sensor area");
      playerNearBuilding = false;
      physicsEnabled = false;
    }
  };
</script>

{#await gltf then gltf}
  <T.Group position={[-53.92, 14.07, -38.65]}>
    <!-- Sensor de proximidad para detectar al jugador -->
    <T.Group position={[-1, -10, -1.5]}>
      <Collider
        onsensorenter={handleSensorEnter}
        onsensorexit={handleSensorExit}
        sensor
        shape="cuboid"
        args={[22, 4, 12]}
      />
    </T.Group>

    <!-- Edificio principal - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="trimesh">
        <T.Mesh
          geometry={gltf.nodes.edificio2.geometry}
          material={gltf.materials["Material.045"]}
        >
          <MeshLineMaterial
            color="#2b134f"
            linewidth={10}
            dashArray={2}
            dashRatio={1}
            dashOffset={0}
            transparent={false}
            depthTest={true}
          />
        </T.Mesh>
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.edificio2.geometry}
        material={gltf.materials["Material.045"]}
      >
        <MeshLineMaterial
          color="#2b134f"
          linewidth={10}
          dashArray={2}
          dashRatio={1}
          dashOffset={0}
          transparent={false}
          depthTest={true}
        />
      </T.Mesh>
    {/if}

    <!-- Anuncios publicitarios (sin física, solo visuales) -->
    <T.Mesh
      geometry={gltf.nodes.ad1.geometry}
      material={gltf.materials["Material.001"]}
      position={[-11.08, 9.38, 9.65]}
      rotation={[0, 0, Math.PI]}
    >
      <T.MeshBasicMaterial map={items[0].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad10.geometry}
      material={gltf.materials["Material.001"]}
      position={[-6.08, 9.38, -11.85]}
      rotation={[0, 0, Math.PI]}
    >
      <T.MeshBasicMaterial map={items[2].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad11.geometry}
      material={gltf.materials["Material.001"]}
      position={[-16.08, 9.38, -12.35]}
      rotation={[0, 0, Math.PI]}
    >
      <T.MeshBasicMaterial map={items[3].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad12.geometry}
      material={gltf.materials["Material.001"]}
      position={[-11.08, -0.08, -12.35]}
    >
      <T.MeshBasicMaterial map={items[4].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad13.geometry}
      material={gltf.materials["Material.001"]}
      position={[-6.08, -7.5, -11.55]}
      rotation={[0, 0, Math.PI]}
    >
      <T.MeshBasicMaterial map={items[5].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad14.geometry}
      material={gltf.materials["Material.001"]}
      position={[-16.08, -7.5, -11.85]}
    >
      <T.MeshBasicMaterial map={items[6].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad2.geometry}
      material={gltf.materials["Material.001"]}
      position={[3.92, 9.38, 9.15]}
      rotation={[0, 0, Math.PI]}
    >
      <T.MeshBasicMaterial map={items[1].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad3.geometry}
      material={gltf.materials["Material.001"]}
      position={[13.92, 9.38, 9.65]}
    >
      <T.MeshBasicMaterial map={items[2].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad4.geometry}
      material={gltf.materials["Material.001"]}
      position={[-9.08, -4.12, 9.15]}
    >
      <T.MeshBasicMaterial map={items[3].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad5.geometry}
      material={gltf.materials["Material.001"]}
      position={[8.92, -0.07, 9.65]}
    >
      <T.MeshBasicMaterial map={items[4].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad6.geometry}
      material={gltf.materials["Material.001"]}
      position={[3.92, -7.5, 8.85]}
    >
      <T.MeshBasicMaterial map={items[5].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad7.geometry}
      material={gltf.materials["Material.001"]}
      position={[13.92, -7.5, 9.15]}
    >
      <T.MeshBasicMaterial map={items[6].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad8.geometry}
      material={gltf.materials["Material.001"]}
      position={[8.92, 9.38, -12.35]}
      rotation={[0, 0, Math.PI]}
    >
      <T.MeshBasicMaterial map={items[0].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad9.geometry}
      material={gltf.materials["Material.001"]}
      position={[8.92, -4.12, -11.85]}
      rotation={[0, 0, Math.PI]}
    >
      <T.MeshBasicMaterial map={items[1].texture} toneMapped={false} />
    </T.Mesh>

    <!-- Banquetas - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.banquetas039.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[19.8, -13.97, -1.35]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas040.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-1.07, -13.97, 9.4]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas041.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-1.07, -13.98, -12.1]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas042.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-21.95, -13.97, -1.35]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.banquetas039.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[19.8, -13.97, -1.35]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas040.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-1.07, -13.97, 9.4]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas041.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-1.07, -13.98, -12.1]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas042.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-21.95, -13.97, -1.35]}
      />
    {/if}
  </T.Group>
{/await}
