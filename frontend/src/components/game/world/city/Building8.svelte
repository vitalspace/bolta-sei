<script lang="ts">
  import { MeshLineMaterial, useDraco, useGltf } from "@threlte/extras";

  import { items } from "#lib/utils/imagenTexture";
  import { T } from "@threlte/core";

  import { AutoColliders, Collider } from "@threlte/rapier";

  const gltf = useGltf("/city-transformed.glb", { dracoLoader: useDraco() });

  let physicsEnabled = $state(false);
  let playerNearBuilding = $state(false);

  const handleSensorEnter = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player entered Building8 sensor area");
      playerNearBuilding = true;
      physicsEnabled = true;
    }
  };

  const handleSensorExit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player exited Building8 sensor area");
      playerNearBuilding = false;
      physicsEnabled = false;
    }
  };
</script>

{#await gltf then gltf}
  <T.Group position={[56.09, 35, 41.35]}>
    <!-- Sensor de proximidad para detectar al jugador -->
    <T.Group position={[-1, -31, -1]}>
      <Collider
        onsensorenter={handleSensorEnter}
        onsensorexit={handleSensorExit}
        sensor
        shape="cuboid"
        args={[22, 4, 12.5]}
      />
    </T.Group>

    <!-- Edificio principal - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="convexHull">
        <T.Mesh
          geometry={gltf.nodes.edificio8.geometry}
          material={gltf.materials["Material.045"]}
          position={[0, -20.92, 0]}
        >
          <MeshLineMaterial
            color="#c2044a"
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
        geometry={gltf.nodes.edificio8.geometry}
        material={gltf.materials["Material.045"]}
        position={[0, -20.92, 0]}
      >
        <MeshLineMaterial
          color="#c2044a"
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
      geometry={gltf.nodes.ad1001.geometry}
      material={gltf.materials["Material.001"]}
      position={[-11.08, -11.55, 9.65]}
    >
      <T.MeshBasicMaterial map={items[0].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad9001.geometry}
      material={gltf.materials["Material.001"]}
      position={[-6.08, -11.55, -11.85]}
    >
      <T.MeshBasicMaterial map={items[1].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad6001.geometry}
      material={gltf.materials["Material.001"]}
      position={[3.92, -28.43, 8.85]}
    >
      <T.MeshBasicMaterial map={items[2].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad8001.geometry}
      material={gltf.materials["Material.001"]}
      position={[8.92, -11.55, -12.35]}
    >
      <T.MeshBasicMaterial map={items[3].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad10001.geometry}
      material={gltf.materials["Material.001"]}
      position={[-16.08, -11.55, -12.35]}
    >
      <T.MeshBasicMaterial map={items[4].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad11001.geometry}
      material={gltf.materials["Material.001"]}
      position={[6.92, -25.05, -11.85]}
    >
      <T.MeshBasicMaterial map={items[5].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad12001.geometry}
      material={gltf.materials["Material.001"]}
      position={[-11.08, -21, -12.35]}
    >
      <T.MeshBasicMaterial map={items[6].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad13001.geometry}
      material={gltf.materials["Material.001"]}
      position={[-6.08, -28.43, -11.55]}
    >
      <T.MeshBasicMaterial map={items[2].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad14001.geometry}
      material={gltf.materials["Material.001"]}
      position={[-16.08, -28.43, -11.85]}
    >
      <T.MeshBasicMaterial map={items[0].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad2001.geometry}
      material={gltf.materials["Material.001"]}
      position={[3.92, -11.55, 9.15]}
      rotation={[0, 0, Math.PI]}
    >
      <T.MeshBasicMaterial map={items[3].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad3001.geometry}
      material={gltf.materials["Material.001"]}
      position={[13.92, -11.55, 9.65]}
    >
      <T.MeshBasicMaterial map={items[4].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad4001.geometry}
      material={gltf.materials["Material.001"]}
      position={[-11.08, -25.05, 9.15]}
    >
      <T.MeshBasicMaterial map={items[5].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad5001.geometry}
      material={gltf.materials["Material.001"]}
      position={[8.92, -21, 9.65]}
    >
      <T.MeshBasicMaterial map={items[1].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad7001.geometry}
      material={gltf.materials["Material.001"]}
      position={[13.92, -28.43, 9.15]}
    >
      <T.MeshBasicMaterial map={items[6].texture} toneMapped={false} />
    </T.Mesh>

    <!-- Banquetas - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.banquetas062.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-21.95, -34.9, -1.35]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas079.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-1.08, -34.9, 9.4]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas080.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-1.08, -34.9, -12.1]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas081.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[19.79, -34.9, -1.35]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.banquetas062.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-21.95, -34.9, -1.35]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas079.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-1.08, -34.9, 9.4]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas080.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-1.08, -34.9, -12.1]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas081.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[19.79, -34.9, -1.35]}
      />
    {/if}
  </T.Group>
{/await}
