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
      console.log("Player entered Gas Station sensor area");
      physicsEnabled = true;
    }
  };

  const handleSensorExit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player exited Gas Station sensor area");
      physicsEnabled = false;
    }
  };
</script>

{#await gltf then gltf}
  <!-- Gasolinera 1 -->
  <T.Group position={[-95, 1.69, 2.12]}>
    <!-- Sensor de proximidad para gasolinera 1 -->
    <T.Group position={[0, 0, -2.5]}>
      <Collider
        onsensorenter={handleSensorEnter}
        onsensorexit={handleSensorExit}
        sensor
        shape="cuboid"
        args={[12, 8, 22]}
      />
    </T.Group>

    {#if physicsEnabled}
      <AutoColliders shape="trimesh">
        <T.Mesh
          geometry={gltf.nodes.gas1_1.geometry}
          material={gltf.materials["Material.031"]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.gas1_1.geometry}
        material={gltf.materials["Material.031"]}
      />
    {/if}

    {#if physicsEnabled}
      <AutoColliders shape="trimesh">
        <T.Mesh
          geometry={gltf.nodes.gas1_2.geometry}
          material={gltf.materials["Material.034"]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.gas1_2.geometry}
        material={gltf.materials["Material.034"]}
      />
    {/if}

    {#if physicsEnabled}
      <AutoColliders shape="trimesh">
        <T.Mesh
          geometry={gltf.nodes.gas1_3.geometry}
          material={gltf.materials["Material.033"]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.gas1_3.geometry}
        material={gltf.materials["Material.033"]}
      />
    {/if}

    {#if physicsEnabled}
      <AutoColliders shape="trimesh">
        <T.Mesh
          geometry={gltf.nodes.gas1_4.geometry}
          material={gltf.nodes.gas1_4.material}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.gas1_4.geometry}
        material={gltf.nodes.gas1_4.material}
      />
    {/if}

    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.banquetas015.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[0.01, -1.58, -23.03]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.banquetas015.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[0.01, -1.58, -23.03]}
      />
    {/if}

    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Group position={[-10.99, -1.54, -0.92]}>
          <T.Mesh
            geometry={gltf.nodes.banquetas016_1.geometry}
            material={gltf.materials["FrontColor.001"]}
          />
          <T.Mesh
            geometry={gltf.nodes.banquetas016_2.geometry}
            material={gltf.materials["Material.031"]}
          />
        </T.Group>
      </AutoColliders>
    {:else}
      <T.Group position={[-10.99, -1.54, -0.92]}>
        <T.Mesh
          geometry={gltf.nodes.banquetas016_1.geometry}
          material={gltf.materials["FrontColor.001"]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas016_2.geometry}
          material={gltf.materials["Material.031"]}
        />
      </T.Group>
    {/if}

    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Group position={[11.01, -1.54, -0.92]}>
          <T.Mesh
            geometry={gltf.nodes.banquetas017_1.geometry}
            material={gltf.materials["FrontColor.001"]}
          />
          <T.Mesh
            geometry={gltf.nodes.banquetas017_2.geometry}
            material={gltf.materials["Material.031"]}
          />
        </T.Group>
      </AutoColliders>
    {:else}
      <T.Group position={[11.01, -1.54, -0.92]}>
        <T.Mesh
          geometry={gltf.nodes.banquetas017_1.geometry}
          material={gltf.materials["FrontColor.001"]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas017_2.geometry}
          material={gltf.materials["Material.031"]}
        />
      </T.Group>
    {/if}

    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.banquetas018.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[0.01, -1.58, 18.78]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.banquetas018.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[0.01, -1.58, 18.78]}
      />
    {/if}

    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.ground003.geometry}
          material={gltf.materials["Material.031"]}
          position={[0, -1.49, -2.12]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.ground003.geometry}
        material={gltf.materials["Material.031"]}
        position={[0, -1.49, -2.12]}
      />
    {/if}

    <T.Group position={[0, 2.49, -17.6]}>
      <T.Mesh
        geometry={gltf.nodes.Mesh102_Group48_Model_1.geometry}
        material={gltf.materials["FrontColor.001"]}
      />
      {#if physicsEnabled}
        <AutoColliders shape="trimesh">
          <T.Mesh
            geometry={gltf.nodes.Mesh102_Group48_Model_2.geometry}
            material={gltf.materials["Material.035"]}
          />
        </AutoColliders>
      {:else}
        <T.Mesh
          geometry={gltf.nodes.Mesh102_Group48_Model_2.geometry}
          material={gltf.materials["Material.035"]}
        />
      {/if}
      <T.Mesh
        geometry={gltf.nodes.Mesh102_Group48_Model_3.geometry}
        material={gltf.materials["Material.036"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Mesh102_Group48_Model_4.geometry}
        material={gltf.materials["Material.002"]}
      />
    </T.Group>

    <T.Group position={[-5.54, -0.62, -19.68]}>
      <T.Mesh
        geometry={gltf.nodes.Mesh89_Group37_Model014_1.geometry}
        material={gltf.materials["Material.002"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Mesh89_Group37_Model014_2.geometry}
        material={gltf.materials["Material.018"]}
      />
    </T.Group>

    <T.Group position={[5.58, -0.62, -19.46]}>
      <T.Mesh
        geometry={gltf.nodes.Mesh89_Group37_Model015_1.geometry}
        material={gltf.materials["Material.002"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Mesh89_Group37_Model015_2.geometry}
        material={gltf.materials["Material.018"]}
      />
    </T.Group>
  </T.Group>

  <!-- Gasolinera 2 -->
  <T.Group position={[93.5, 1.69, 2.12]}>
    <!-- Sensor de proximidad para gasolinera 2 -->
    <T.Group position={[0, 0, -2.5]}>
      <Collider
        onsensorenter={handleSensorEnter}
        onsensorexit={handleSensorExit}
        sensor
        shape="cuboid"
        args={[12, 8, 22]}
      />
    </T.Group>

    {#if physicsEnabled}
      <AutoColliders shape="trimesh">
        <T.Mesh
          geometry={gltf.nodes.gas2_1.geometry}
          material={gltf.materials["Material.031"]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.gas2_1.geometry}
        material={gltf.materials["Material.031"]}
      />
    {/if}

    {#if physicsEnabled}
      <AutoColliders shape="trimesh">
        <T.Mesh
          geometry={gltf.nodes.gas2_2.geometry}
          material={gltf.materials["Material.034"]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.gas2_2.geometry}
        material={gltf.materials["Material.034"]}
      />
    {/if}

    {#if physicsEnabled}
      <AutoColliders shape="trimesh">
        <T.Mesh
          geometry={gltf.nodes.gas2_3.geometry}
          material={gltf.materials["Material.033"]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.gas2_3.geometry}
        material={gltf.materials["Material.033"]}
      />
    {/if}

    {#if physicsEnabled}
      <AutoColliders shape="trimesh">
        <T.Mesh
          geometry={gltf.nodes.gas2_4.geometry}
          material={gltf.nodes.gas2_4.material}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.gas2_4.geometry}
        material={gltf.nodes.gas2_4.material}
      />
    {/if}

    <T.Group position={[5.56, -0.62, 15.4]} rotation={[Math.PI, 0, Math.PI]}>
      <T.Mesh
        geometry={gltf.nodes.Mesh89_Group37_Model014_1.geometry}
        material={gltf.materials["Material.002"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Mesh89_Group37_Model014_2.geometry}
        material={gltf.materials["Material.018"]}
      />
    </T.Group>

    <T.Group position={[-5.5, -0.69, 14.88]} rotation={[Math.PI, 0, Math.PI]}>
      <T.Mesh
        geometry={gltf.nodes.Mesh89_Group37_Model015_1.geometry}
        material={gltf.materials["Material.002"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Mesh89_Group37_Model015_2.geometry}
        material={gltf.materials["Material.018"]}
      />
    </T.Group>

    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.banquetas011.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[0.53, -1.58, -22.98]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.banquetas011.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[0.53, -1.58, -22.98]}
      />
    {/if}

    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Group position={[-11, -1.54, -0.92]}>
          <T.Mesh
            geometry={gltf.nodes.banquetas012_1.geometry}
            material={gltf.materials["FrontColor.001"]}
          />
          <T.Mesh
            geometry={gltf.nodes.banquetas012_2.geometry}
            material={gltf.materials["Material.031"]}
          />
        </T.Group>
      </AutoColliders>
    {:else}
      <T.Group position={[-11, -1.54, -0.92]}>
        <T.Mesh
          geometry={gltf.nodes.banquetas012_1.geometry}
          material={gltf.materials["FrontColor.001"]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas012_2.geometry}
          material={gltf.materials["Material.031"]}
        />
      </T.Group>
    {/if}

    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Group position={[11, -1.54, -0.92]}>
          <T.Mesh
            geometry={gltf.nodes.banquetas013_1.geometry}
            material={gltf.materials["FrontColor.001"]}
          />
          <T.Mesh
            geometry={gltf.nodes.banquetas013_2.geometry}
            material={gltf.materials["Material.031"]}
          />
        </T.Group>
      </AutoColliders>
    {:else}
      <T.Group position={[11, -1.54, -0.92]}>
        <T.Mesh
          geometry={gltf.nodes.banquetas013_1.geometry}
          material={gltf.materials["FrontColor.001"]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas013_2.geometry}
          material={gltf.materials["Material.031"]}
        />
      </T.Group>
    {/if}

    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.banquetas014.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[0, -1.58, 18.78]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.banquetas014.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[0, -1.58, 18.78]}
      />
    {/if}

    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.ground004.geometry}
          material={gltf.materials["Material.031"]}
          position={[0, -1.49, -2.12]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.ground004.geometry}
        material={gltf.materials["Material.031"]}
        position={[0, -1.49, -2.12]}
      />
    {/if}

    <T.Group position={[0.02, 2.49, 13.32]} rotation={[Math.PI, 0, Math.PI]}>
      <T.Mesh
        geometry={gltf.nodes.Mesh102_Group48_Model002_1.geometry}
        material={gltf.materials["FrontColor.001"]}
      />
      {#if physicsEnabled}
        <AutoColliders shape="trimesh">
          <T.Mesh
            geometry={gltf.nodes.Mesh102_Group48_Model002_2.geometry}
            material={gltf.materials["Material.035"]}
          />
        </AutoColliders>
      {:else}
        <T.Mesh
          geometry={gltf.nodes.Mesh102_Group48_Model002_2.geometry}
          material={gltf.materials["Material.035"]}
        />
      {/if}
      <T.Mesh
        geometry={gltf.nodes.Mesh102_Group48_Model002_3.geometry}
        material={gltf.materials["Material.036"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Mesh102_Group48_Model002_4.geometry}
        material={gltf.materials["Material.002"]}
      />
    </T.Group>
  </T.Group>
{/await}
