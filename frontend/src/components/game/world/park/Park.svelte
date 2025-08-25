<script lang="ts">
  import { items } from "#lib/utils/imagenTexture";
  import { currentSongUrl, isOnStage } from "#stores/parkStores";
  import { T } from "@threlte/core";
  import {
    FakeGlowMaterial,
    MeshLineMaterial,
    useDraco,
    useGltf,
  } from "@threlte/extras";
  import { AutoColliders, Collider } from "@threlte/rapier";
  import CheckPoints from "./AudioMusicCheckPoint.svelte";
  // import Racing from "./Racing.svelte";
  import Ads from "./Ads.svelte";

  import { gameState } from "#stores/gameStore";
  const { player } = $gameState;

  const gltf = useGltf("/city-transformed.glb", { dracoLoader: useDraco() });

  let physicsEnabled = $state(false);

  const handleSensorEnter = (event: any) => {
    console.log("Player entered Park sensor area",event);

    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    console.log("Player entered Park sensor area", userData );

    if (userData?.name === "player" || userData?.name === "Car") {
      physicsEnabled = true;
    }
  };

  const handleSensorExit = (event: any) => {
    console.log("Player entered Park sensor area",event);
    
    const { targetRigidBody } = event;

    const userData = targetRigidBody.userData;

    console.log("Player exited Park sensor area", userData );

    if (userData?.name === "player" || userData?.name === "Car") {
      physicsEnabled = false;

      // Limpiar la canción cuando el jugador sale de la zona del parque
      currentSongUrl.set(null);
    }
  };

  const handleInteriorEnter = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player") {
      isOnStage.set(true);
    }
  };

  const handleInteriorExit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player") {
      isOnStage.set(false);
    }
  };
</script>

{#await gltf then gltf}
  {#if physicsEnabled}
    <!-- <Racing /> -->
    <!-- <Ads /> -->
  {/if}
  <T.Group position={[0, 12.74, 0]}>
    <!-- Sensor de proximidad para detectar al jugador -->
    <T.Group position={[0, -8.6, 0]}>
      <Collider
        onsensorenter={handleSensorEnter}
        onsensorexit={handleSensorExit}
        sensor
        shape="cuboid"
        args={[27, 4, 22]}
      />
    </T.Group>

    <T.Group
      position={[-8.5, -9.27, 17]}
      rotation={[-Math.PI, Math.PI / 9, -Math.PI]}
      scale={[0.5, 2.5, 0.46]}
    >
      {#if physicsEnabled}
        <AutoColliders shape={"trimesh"}>
          <T.Mesh
            geometry={gltf.nodes.warzone_stand_1.geometry}
            material={gltf.materials["Material.140"]}
          />
        </AutoColliders>
      {:else}
        <T.Mesh
          geometry={gltf.nodes.warzone_stand_1.geometry}
          material={gltf.materials["Material.140"]}
        />
      {/if}
      <T.Mesh
        geometry={gltf.nodes.warzone_stand_2.geometry}
        material={gltf.materials["Material.141"]}
      >
        <MeshLineMaterial
          color="#b31547"
          linewidth={10}
          dashArray={2}
          dashRatio={1}
          dashOffset={0}
          transparent={false}
          depthTest={true}
        />
      </T.Mesh>
      <T.Mesh
        geometry={gltf.nodes.warzone_stand_3.geometry}
        material={gltf.materials["Material.001"]}
      >
        <FakeGlowMaterial
          glowColor="cyan"
          falloff={1}
          glowInternalRadius={0.1}
          glowSharpness={5}
          depthTest={true}
        />
        <T.PointLight color="cyan" position={[2, 0, 4]} intensity={80} />
        <T.PointLight color="purple" position={[-2, 0, 4]} intensity={80} />
      </T.Mesh>
    </T.Group>

    <T.Group
      position={[-8.5, -9.27, -17]}
      rotation={[0, Math.PI / 6, 0]}
      scale={[0.5, 2.5, 0.5]}
    >
      {#if physicsEnabled}
        <AutoColliders shape={"trimesh"}>
          <T.Mesh
            geometry={gltf.nodes.racing_stand_1.geometry}
            material={gltf.materials["Material.140"]}
          />
        </AutoColliders>
      {:else}
        <T.Mesh
          geometry={gltf.nodes.racing_stand_1.geometry}
          material={gltf.materials["Material.140"]}
        />
      {/if}
      <T.Mesh
        geometry={gltf.nodes.racing_stand_2.geometry}
        material={gltf.materials["Material.141"]}
      >
        <MeshLineMaterial
          color="#b31547"
          linewidth={10}
          dashArray={2}
          dashRatio={1}
          dashOffset={0}
          transparent={false}
          depthTest={true}
        />
      </T.Mesh>
      <T.Mesh geometry={gltf.nodes.racing_stand_3.geometry}>
        <FakeGlowMaterial
          glowColor="cyan"
          falloff={1}
          glowInternalRadius={0.1}
          glowSharpness={5}
          depthTest={true}
        />
        <T.PointLight color="cyan" position={[2, 0, 4]} intensity={80} />
        <T.PointLight color="purple" position={[-2, 0, 4]} intensity={80} />

        <!-- <T.MeshLineMaterial color="red" linewidth={0.1} /> -->
      </T.Mesh>
    </T.Group>

    <!-- Anuncios del parque (sin física, solo visuales) -->
    <T.Mesh
      geometry={gltf.nodes.ad_park_1001.geometry}
      material={gltf.nodes.ad_park_1001.material}
      position={[20.09, -9.54, -14.45]}
    >
      <T.MeshBasicMaterial map={items[7].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad_park_2001.geometry}
      material={gltf.nodes.ad_park_2001.material}
      position={[20.09, -9.54, 14.95]}
    />
    <!-- Atrio - solo collider activo cuando el jugador está cerca -->
    <T.Group position={[22, -10.96, 0]}>
      <T.Mesh
        geometry={gltf.nodes.atrio_1.geometry}
        material={gltf.materials["_.001"]}
      />
      <T.Mesh
        geometry={gltf.nodes.atrio_2.geometry}
        material={gltf.materials["Material.089"]}
      />
      {#if physicsEnabled}
        <AutoColliders shape="trimesh">
          <T.Mesh
            geometry={gltf.nodes.atrio_3.geometry}
            material={gltf.materials["Material.090"]}
          />
        </AutoColliders>
      {:else}
        <T.Mesh
          geometry={gltf.nodes.atrio_3.geometry}
          material={gltf.materials["Material.090"]}
        />
      {/if}
    </T.Group>
    <!-- Banquetas del parque - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.banquetas027.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[25.88, -12.64, 0]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas028.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[0.01, -12.64, -20.75]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas029.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[0.01, -12.64, 20.75]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas030.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-25.86, -12.64, 0]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.banquetas027.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[25.88, -12.64, 0]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas028.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[0.01, -12.64, -20.75]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas029.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[0.01, -12.64, 20.75]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas030.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-25.86, -12.64, 0]}
      />
    {/if}

    <T.Mesh
      geometry={gltf.nodes.Cube001.geometry}
      material={gltf.materials["Material.113"]}
      position={[-16.03, -12.67, 10.85]}
    />
    <T.Mesh
      geometry={gltf.nodes.Cube002.geometry}
      material={gltf.materials["Material.113"]}
      position={[-22.81, -12.38, 13.47]}
    />
    <T.Mesh
      geometry={gltf.nodes.Cube003.geometry}
      material={gltf.materials["Material.113"]}
      position={[-15.13, -12.7, 17.41]}
    />
    <T.Mesh
      geometry={gltf.nodes.Cube004.geometry}
      material={gltf.materials["Material.113"]}
      position={[-16.2, -12.7, 18.27]}
    />
    <T.Mesh
      geometry={gltf.nodes.Cube005.geometry}
      material={gltf.materials["Material.113"]}
      position={[-15.25, -12.7, 18.32]}
    />
    <T.Mesh
      geometry={gltf.nodes.Cube006.geometry}
      material={gltf.materials["Material.113"]}
      position={[-16.33, -12.7, -14.91]}
    />
    <T.Mesh
      geometry={gltf.nodes.Cube007.geometry}
      material={gltf.materials["Material.113"]}
      position={[-16.73, -12.7, -13.59]}
    />
    <T.Mesh
      geometry={gltf.nodes.Cube008.geometry}
      material={gltf.materials["Material.113"]}
      position={[-15.92, -12.7, -14.09]}
    />
    <T.Mesh
      geometry={gltf.nodes.Cube009.geometry}
      material={gltf.materials["Material.113"]}
      position={[-20.2, -12.7, -8.28]}
    />
    <T.Mesh
      geometry={gltf.nodes.Cube010.geometry}
      material={gltf.materials["Material.113"]}
      position={[-20.88, -12.7, -7]}
    />
    <T.Mesh
      geometry={gltf.nodes.Cube011.geometry}
      material={gltf.materials["Material.113"]}
      position={[-19.78, -12.7, -7.46]}
    />
    <T.Group position={[-21.13, -9.78, -8.39]}>
      <T.Mesh
        geometry={gltf.nodes.Cylinder017_1.geometry}
        material={gltf.materials["Material.106"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Cylinder017_2.geometry}
        material={gltf.materials["Material.107"]}
      />
    </T.Group>
    <T.Group position={[-22.85, -9.78, 12.14]}>
      <T.Mesh
        geometry={gltf.nodes.Cylinder021_1.geometry}
        material={gltf.materials["Material.106"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Cylinder021_2.geometry}
        material={gltf.materials["Material.107"]}
      />
    </T.Group>
    <T.Group position={[-17.11, -9.78, 18.61]}>
      <T.Mesh
        geometry={gltf.nodes.Cylinder022_1.geometry}
        material={gltf.materials["Material.106"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Cylinder022_2.geometry}
        material={gltf.materials["Material.107"]}
      />
    </T.Group>
    <T.Group position={[-13.65, -9.78, 11.99]}>
      <T.Mesh
        geometry={gltf.nodes.Cylinder023_1.geometry}
        material={gltf.materials["Material.106"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Cylinder023_2.geometry}
        material={gltf.materials["Material.107"]}
      />
    </T.Group>
    <T.Group position={[-15.03, -9.78, -17.65]}>
      <T.Mesh
        geometry={gltf.nodes.Cylinder024_1.geometry}
        material={gltf.materials["Material.106"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Cylinder024_2.geometry}
        material={gltf.materials["Material.107"]}
      />
    </T.Group>
    <T.Mesh
      geometry={gltf.nodes.fuente.geometry}
      material={gltf.materials["Material.001"]}
      position={[-18.48, -12.31, 14.59]}
      scale={[1.99, 0.81, 1.99]}
    />
    <!-- Suelo del parque - solo collider activo cuando el jugador está cerca -->
    <T.Group position={[-10.03, -12.86, 9.25]}>
      {#if physicsEnabled}
        <AutoColliders shape="cuboid">
          <T.Mesh
            geometry={gltf.nodes.GroundParkGeneral_1.geometry}
            material={gltf.materials["_.001"]}
          />
          <T.Mesh
            geometry={gltf.nodes.GroundParkGeneral_2.geometry}
            material={gltf.materials["Material.111"]}
          />
          <T.Mesh
            geometry={gltf.nodes.GroundParkGeneral_3.geometry}
            material={gltf.materials["Material.112"]}
          />
        </AutoColliders>
      {:else}
        <T.Mesh
          geometry={gltf.nodes.GroundParkGeneral_1.geometry}
          material={gltf.materials["_.001"]}
        />
        <T.Mesh
          geometry={gltf.nodes.GroundParkGeneral_2.geometry}
          material={gltf.materials["Material.111"]}
        />
        <T.Mesh
          geometry={gltf.nodes.GroundParkGeneral_3.geometry}
          material={gltf.materials["Material.112"]}
        />
      {/if}
    </T.Group>
    <T.Mesh
      geometry={gltf.nodes.Mesh106_Group52_Group51_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[-21.1, -10.66, -12.32]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh107_Group53_Group51_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[-21.61, -10.66, -15.61]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh108_Group54_Group51_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[-17.49, -10.66, -13.56]}
    />
    <!-- Rocas/piedras del parque - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.Mesh106_Group52_Group51_Model.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-21.1, -10.76, -12.32]}
        />
        <T.Mesh
          geometry={gltf.nodes.Mesh107_Group53_Group51_Model.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-21.61, -10.76, -15.61]}
        />
        <T.Mesh
          geometry={gltf.nodes.Mesh108_Group54_Group51_Model.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-17.49, -10.76, -13.56]}
        />
        <T.Mesh
          geometry={gltf.nodes.Mesh109_Group55_Group51_Model.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-19.69, -10.76, -12.28]}
        />
        <T.Mesh
          geometry={gltf.nodes.Mesh110_Group56_Group51_Model.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-19.41, -10.76, -16.88]}
        />
        <T.Mesh
          geometry={gltf.nodes.Mesh111_Group57_Group51_Model.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-16.81, -10.76, -14.8]}
        />
        <T.Mesh
          geometry={gltf.nodes.Mesh112_Group58_Group51_Model.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-17.99, -10.76, -16.84]}
        />
        <T.Mesh
          geometry={gltf.nodes.Mesh113_Group59_Group51_Model.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-22.28, -10.76, -14.36]}
        />
      </AutoColliders>
    {/if}
    <!-- Área de la fuente - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="trimesh">
        <T.Mesh
          geometry={gltf.nodes.Mesh114_Group51_Model.geometry}
          material={gltf.materials["Material.110"]}
          position={[-19.55, -12.3, -14.58]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.Mesh114_Group51_Model.geometry}
        material={gltf.materials["Material.110"]}
        position={[-19.55, -12.3, -14.58]}
      />
    {/if}
    <T.Mesh
      geometry={gltf.nodes.Mesh115_Group51_Model.geometry}
      material={gltf.materials["Material.109"]}
      position={[-19.55, -8.83, -14.58]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh47_D_0_30_m1_Model.geometry}
      material={gltf.materials["Material.002"]}
      position={[21.83, -9.91, -0.01]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh49_Group27_Group26_Model.geometry}
      material={gltf.nodes.Mesh49_Group27_Group26_Model.material}
      position={[20.23, -9.54, -14.5]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh50_D_0_30_m3_Group26_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[20.23, -12.04, -14.5]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh51_Group29_Group28_Model.geometry}
      material={gltf.nodes.Mesh51_Group29_Group28_Model.material}
      position={[20.23, -9.54, 15]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh52_D_0_30_m4_Group28_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[20.23, -12.04, 15]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh76_D_0_10_m_Group31_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[19.77, -9.21, 3]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh77_D_0_10_m1_Group31_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[19.77, -9.21, -3]}
    />
    <T.Group position={[19.66, -9.27, -3]}>
      <T.Mesh
        geometry={gltf.nodes.Mesh78_Component_15_1_Group31_Model_1.geometry}
        material={gltf.materials["FrontColor.001"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Mesh78_Component_15_1_Group31_Model_2.geometry}
        material={gltf.nodes.Mesh78_Component_15_1_Group31_Model_2.material}
      />
    </T.Group>
    <T.Group position={[20.06, -9.77, -3]}>
      <T.Mesh
        geometry={gltf.nodes.Mesh79_Group32_Component_13_1_Group31_Model_1
          .geometry}
        material={gltf.materials["FrontColor.001"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Mesh79_Group32_Component_13_1_Group31_Model_2
          .geometry}
        material={gltf.nodes.Mesh79_Group32_Component_13_1_Group31_Model_2
          .material}
      />
    </T.Group>
    <T.Group position={[19.84, -9.54, -3]}>
      <T.Mesh
        geometry={gltf.nodes.Mesh80_Component_14_1_Group31_Model_1.geometry}
        material={gltf.materials["FrontColor.001"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Mesh80_Component_14_1_Group31_Model_2.geometry}
        material={gltf.nodes.Mesh80_Component_14_1_Group31_Model_2.material}
      />
    </T.Group>
    <T.Group position={[19.53, -8.98, -3]}>
      <T.Mesh
        geometry={gltf.nodes.Mesh81_Component_16_1_Group31_Model_1.geometry}
        material={gltf.materials["FrontColor.001"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Mesh81_Component_16_1_Group31_Model_2.geometry}
        material={gltf.nodes.Mesh81_Component_16_1_Group31_Model_2.material}
      />
    </T.Group>
    <T.Group position={[20.06, -9.77, 3]}>
      <T.Mesh
        geometry={gltf.nodes.Mesh82_Group33_Component_13_2_Group31_Model_1
          .geometry}
        material={gltf.materials["FrontColor.001"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Mesh82_Group33_Component_13_2_Group31_Model_2
          .geometry}
        material={gltf.materials["Material.001"]}
      />
    </T.Group>
    <T.Group position={[19.53, -8.98, 3]}>
      <T.Mesh
        geometry={gltf.nodes.Mesh83_Component_16_2_Group31_Model_1.geometry}
        material={gltf.materials["FrontColor.001"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Mesh83_Component_16_2_Group31_Model_2.geometry}
        material={gltf.nodes.Mesh83_Component_16_2_Group31_Model_2.material}
      />
    </T.Group>
    <T.Group position={[19.84, -9.54, 3]}>
      <T.Mesh
        geometry={gltf.nodes.Mesh84_Component_14_2_Group31_Model_1.geometry}
        material={gltf.materials["FrontColor.001"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Mesh84_Component_14_2_Group31_Model_2.geometry}
        material={gltf.materials["Material.001"]}
      />
    </T.Group>
    <T.Group position={[19.66, -9.27, 3]}>
      <T.Mesh
        geometry={gltf.nodes.Mesh85_Component_15_2_Group31_Model_1.geometry}
        material={gltf.materials["FrontColor.001"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Mesh85_Component_15_2_Group31_Model_2.geometry}
        material={gltf.nodes.Mesh85_Component_15_2_Group31_Model_2.material}
      />
    </T.Group>
    <!-- Paredes del parque - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.pared.geometry}
          material={gltf.materials["Material.087"]}
          position={[13.63, -12.04, -19.75]}
        />
        <T.Mesh
          geometry={gltf.nodes.pared001.geometry}
          material={gltf.materials["Material.087"]}
          position={[24.75, -12.04, 0]}
        />
        <T.Mesh
          geometry={gltf.nodes.pared002.geometry}
          material={gltf.materials["Material.087"]}
          position={[10.59, -11.99, 19.77]}
        />
        <T.Mesh
          geometry={gltf.nodes.pared003.geometry}
          material={gltf.materials["Material.087"]}
          position={[-9.92, -12.04, 19.75]}
        />
        <T.Group position={[-24.75, -12.04, 11.13]}>
          <T.Mesh
            geometry={gltf.nodes.pared004_1.geometry}
            material={gltf.materials["_.001"]}
          />
          <T.Mesh
            geometry={gltf.nodes.pared004_2.geometry}
            material={gltf.materials["Material.087"]}
          />
        </T.Group>
        <T.Mesh
          geometry={gltf.nodes.pared005.geometry}
          material={gltf.materials["Material.087"]}
          position={[-24.77, -11.92, -10.46]}
        />
        <T.Mesh
          geometry={gltf.nodes.pared006.geometry}
          material={gltf.materials["Material.087"]}
          position={[-13.58, -11.96, -19.67]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.pared.geometry}
        material={gltf.materials["Material.087"]}
        position={[13.63, -12.04, -19.75]}
      />
      <T.Mesh
        geometry={gltf.nodes.pared001.geometry}
        material={gltf.materials["Material.087"]}
        position={[24.75, -12.04, 0]}
      />
      <T.Mesh
        geometry={gltf.nodes.pared002.geometry}
        material={gltf.materials["Material.087"]}
        position={[10.59, -11.99, 19.77]}
      />
      <T.Mesh
        geometry={gltf.nodes.pared003.geometry}
        material={gltf.materials["Material.087"]}
        position={[-9.92, -12.04, 19.75]}
      />
      <T.Group position={[-24.75, -12.04, 11.13]}>
        <T.Mesh
          geometry={gltf.nodes.pared004_1.geometry}
          material={gltf.materials["_.001"]}
        />
        <T.Mesh
          geometry={gltf.nodes.pared004_2.geometry}
          material={gltf.materials["Material.087"]}
        />
      </T.Group>
      <T.Mesh
        geometry={gltf.nodes.pared005.geometry}
        material={gltf.materials["Material.087"]}
        position={[-24.77, -11.92, -10.46]}
      />
      <T.Mesh
        geometry={gltf.nodes.pared006.geometry}
        material={gltf.materials["Material.087"]}
        position={[-13.58, -11.96, -19.67]}
      />
    {/if}
    <T.Mesh
      geometry={gltf.nodes.sei001.geometry}
      material={gltf.nodes.sei001.material}
      position={[19.5, -7.54, 0]}
      rotation={[Math.PI / 2, 0, 1.57]}
      scale={[141.84, 30.4, 141.51]}
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
    </T.Mesh>

    <!-- Interior del atrio - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <T.Group position={[22, -10.5, 0]}>
        <Collider
          onsensorenter={handleInteriorEnter}
          onsensorexit={handleInteriorExit}
          sensor
          shape="cuboid"
          args={[2.5, 1, 4.5]}
        />
      </T.Group>

      <CheckPoints />

      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.interioAtrio.geometry}
          material={gltf.materials["Material.090"]}
          position={[22, -11.54, 0]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.interioAtrio.geometry}
        material={gltf.materials["Material.090"]}
        position={[22, -11.54, 0]}
      />
    {/if}

    <!-- Mesa del DJ - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.Table.geometry}
          material={gltf.materials["Material.002"]}
          position={[21.48, -11.22, 0]}
          scale={[0.75, 0.38, 2.25]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.Table.geometry}
        material={gltf.materials["Material.002"]}
        position={[21.48, -11.22, 0]}
        scale={[0.75, 0.38, 2.25]}
      />
    {/if}

    <T.Mesh
      geometry={gltf.nodes.dj001.geometry}
      material={gltf.materials.FrontColor}
      position={[21.59, -10.74, 0]}
      rotation={[Math.PI, 0, Math.PI]}
      scale={1.5}
    />
  </T.Group>

  <T.Group position={[18, 5.3, 0]}>
    <T.PointLight color="#6200ff" intensity={100} />
    <!-- <T.Mesh>
      <T.BoxGeometry args={[0.1, 0.1, 0.1]} />
      <T.MeshStandardMaterial color="red" />
    </T.Mesh> -->
  </T.Group>

  <T.Group position={[21.5, 3, 0]}>
    <T.PointLight color="cyan" intensity={100} />
    <!-- <T.Mesh>
      <T.BoxGeometry args={[0.1, 0.1, 0.1]} />
      <T.MeshStandardMaterial color="red" />
    </T.Mesh> -->
  </T.Group>

  <T.Group position={[19, 3, 3]}>
    <T.PointLight color="#6200ff" intensity={100} />
    <!-- <T.Mesh>
      <T.BoxGeometry args={[0.1, 0.1, 0.1]} />
      <T.MeshStandardMaterial color="red" />
    </T.Mesh> -->
  </T.Group>

  <T.Group position={[19, 3, -3]}>
    <T.PointLight color="#6200ff" intensity={100} />
    <!-- <T.Mesh>
      <T.BoxGeometry args={[0.1, 0.1, 0.1]} />
      <T.MeshStandardMaterial color="red" />
    </T.Mesh> -->
  </T.Group>
{/await}
