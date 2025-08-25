<script lang="ts">
  import { useDraco, useGltf } from "@threlte/extras";

  import { T } from "@threlte/core";
  import { AutoColliders, Collider } from "@threlte/rapier";

  const gltf = useGltf("/city-transformed.glb", { dracoLoader: useDraco() });

  let physicsEnabled = $state(false);
  let playerNearStation = $state(false);

  const handleSensorEnter = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player entered Station sensor area");
      playerNearStation = true;
      physicsEnabled = true;
    }
  };

  const handleSensorExit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player exited Station sensor area");
      playerNearStation = false;
      physicsEnabled = false;
    }
  };
</script>

{#await gltf then gltf}
  <T.Group position={[-92.53, 15, 53.49]}>
    <!-- Sensor de proximidad para detectar al jugador -->

    <T.Group position={[22.5, -11, 1.5]}>
      <Collider
        onsensorenter={handleSensorEnter}
        onsensorexit={handleSensorExit}
        sensor
        shape="cuboid"
        args={[37, 4, 27]}
      />
    </T.Group>

    <!-- Estructura principal de la estación - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="trimesh">
        <T.Mesh
          geometry={gltf.nodes.station_1.geometry}
          material={gltf.materials["Material.088"]}
        />
        <T.Mesh
          geometry={gltf.nodes.station_2.geometry}
          material={gltf.materials["Material.001"]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.station_1.geometry}
        material={gltf.materials["Material.088"]}
      />
      <T.Mesh
        geometry={gltf.nodes.station_2.geometry}
        material={gltf.materials["Material.001"]}
      />
    {/if}
    <!-- Banquetas y bardas - solo colliders activos cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.banquetas001.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[58.15, -14.92, -11.41]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas002.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[37.95, -14.9, 6.76]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas003.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[37.95, -14.9, -3.74]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas004.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[58.09, -14.9, 16.51]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas005.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[22.54, -14.9, 26.26]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas006.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-13.09, -14.88, -3.38]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas007.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[22.54, -14.9, -23.24]}
        />
        <T.Mesh
          geometry={gltf.nodes.bardas001.geometry}
          material={gltf.nodes.bardas001.material}
          position={[57.28, -13.4, -13.49]}
        />
        <T.Mesh
          geometry={gltf.nodes.bardas002.geometry}
          material={gltf.nodes.bardas002.material}
          position={[47.41, -13.4, -3.74]}
        />
        <T.Mesh
          geometry={gltf.nodes.bardas003.geometry}
          material={gltf.nodes.bardas003.material}
          position={[22.53, -13.4, -23.24]}
        />
        <T.Mesh
          geometry={gltf.nodes.bardas004.geometry}
          material={gltf.nodes.bardas004.material}
          position={[-12.27, -13.12, 1.51]}
        />
        <T.Mesh
          geometry={gltf.nodes.bardas005.geometry}
          material={gltf.nodes.bardas005.material}
          position={[47.41, -13.4, 6.76]}
        />
        <T.Mesh
          geometry={gltf.nodes.bardas006.geometry}
          material={gltf.nodes.bardas006.material}
          position={[57.28, -13.4, 16.51]}
        />
        <T.Mesh
          geometry={gltf.nodes.bardas007.geometry}
          material={gltf.nodes.bardas007.material}
          position={[22.53, -13.4, 26.26]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.banquetas001.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[58.15, -14.92, -11.41]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas002.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[37.95, -14.9, 6.76]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas003.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[37.95, -14.9, -3.74]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas004.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[58.09, -14.9, 16.51]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas005.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[22.54, -14.9, 26.26]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas006.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-13.09, -14.88, -3.38]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas007.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[22.54, -14.9, -23.24]}
      />
      <T.Mesh
        geometry={gltf.nodes.bardas001.geometry}
        material={gltf.nodes.bardas001.material}
        position={[57.28, -13.4, -13.49]}
      />
      <T.Mesh
        geometry={gltf.nodes.bardas002.geometry}
        material={gltf.nodes.bardas002.material}
        position={[47.41, -13.4, -3.74]}
      />
      <T.Mesh
        geometry={gltf.nodes.bardas003.geometry}
        material={gltf.nodes.bardas003.material}
        position={[22.53, -13.4, -23.24]}
      />
      <T.Mesh
        geometry={gltf.nodes.bardas004.geometry}
        material={gltf.nodes.bardas004.material}
        position={[-12.27, -13.12, 1.51]}
      />
      <T.Mesh
        geometry={gltf.nodes.bardas005.geometry}
        material={gltf.nodes.bardas005.material}
        position={[47.41, -13.4, 6.76]}
      />
      <T.Mesh
        geometry={gltf.nodes.bardas006.geometry}
        material={gltf.nodes.bardas006.material}
        position={[57.28, -13.4, 16.51]}
      />
      <T.Mesh
        geometry={gltf.nodes.bardas007.geometry}
        material={gltf.nodes.bardas007.material}
        position={[22.53, -13.4, 26.26]}
      />
    {/if}
    <!-- Caseta - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.caseta.geometry}
          material={gltf.materials["Material.042"]}
          position={[47.72, -14.08, 4.11]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.caseta.geometry}
        material={gltf.materials["Material.042"]}
        position={[47.72, -14.08, 4.11]}
      />
    {/if}
    <!-- Escaleras - solo colliders activos cuando el jugador está cerca -->
    <T.Group position={[0.33, -12.27, 2.21]}>
      {#if physicsEnabled}
        <AutoColliders shape="trimesh">
          <T.Mesh
            geometry={gltf.nodes.escaleras_1.geometry}
            material={gltf.materials["Material.005"]}
          />
          <T.Mesh
            geometry={gltf.nodes.escaleras_2.geometry}
            material={gltf.materials["Material.039"]}
          />
          <T.Mesh
            geometry={gltf.nodes.escaleras_3.geometry}
            material={gltf.materials["Material.001"]}
          />
        </AutoColliders>
      {:else}
        <T.Mesh
          geometry={gltf.nodes.escaleras_1.geometry}
          material={gltf.materials["Material.005"]}
        />
        <T.Mesh
          geometry={gltf.nodes.escaleras_2.geometry}
          material={gltf.materials["Material.039"]}
        />
        <T.Mesh
          geometry={gltf.nodes.escaleras_3.geometry}
          material={gltf.materials["Material.001"]}
        />
      {/if}
    </T.Group>
    <T.Mesh
      geometry={gltf.nodes.Mesh120_D_0_10_m2_Group64_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[17.55, -10.9, 9.17]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh126_Group64_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[-1.47, 0, -8.17]}
    />
    <!-- Mesh206 Models - solo colliders activos cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.Mesh206_Model.geometry}
          material={gltf.materials["Material.040"]}
          position={[47.53, -14.35, -1.39]}
        />
        <T.Mesh
          geometry={gltf.nodes.Mesh206_Model001.geometry}
          material={gltf.materials["Material.040"]}
          position={[47.53, -14.35, 3.01]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.Mesh206_Model.geometry}
        material={gltf.materials["Material.040"]}
        position={[47.53, -14.35, -1.39]}
      />
      <T.Mesh
        geometry={gltf.nodes.Mesh206_Model001.geometry}
        material={gltf.materials["Material.040"]}
        position={[47.53, -14.35, 3.01]}
      />
    {/if}
    <T.Group position={[17.55, -10.55, 9.17]}>
      <T.Mesh
        geometry={gltf.nodes.pc_1.geometry}
        material={gltf.materials["FrontColor.001"]}
      />
      <T.Mesh
        geometry={gltf.nodes.pc_2.geometry}
        material={gltf.nodes.pc_2.material}
      />
    </T.Group>
    <!-- Pluma - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.pluma.geometry}
          material={gltf.materials["Material.041"]}
          position={[47.53, -14.2, 3.41]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.pluma.geometry}
        material={gltf.materials["Material.041"]}
        position={[47.53, -14.2, 3.41]}
      />
    {/if}
    <T.Group position={[7.92, 9.63, 1.57]}>
      <T.Mesh
        geometry={gltf.nodes["space-ship_1"].geometry}
        material={gltf.materials["Material.010"]}
      />
      <!-- <T.Mesh
        geometry={gltf.nodes["space-ship_2"].geometry}
        material={gltf.materials["Material.002"]}
      /> -->
      <T.Mesh
        geometry={gltf.nodes["space-ship_3"].geometry}
        material={gltf.materials["Material.001"]}
      />
      <T.Mesh
        geometry={gltf.nodes["space-ship_4"].geometry}
        material={gltf.materials["Material.002"]}
      />
      <T.Mesh
        geometry={gltf.nodes["space-ship_5"].geometry}
        material={gltf.materials["Material.057"]}
      />
      <T.Mesh
        geometry={gltf.nodes["space-ship_6"].geometry}
        material={gltf.materials["Material.059"]}
      />
    </T.Group>
  </T.Group>
{/await}
