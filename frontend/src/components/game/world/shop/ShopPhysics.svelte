<script lang="ts">
  import { T } from "@threlte/core";
  import { useDraco, useGltf } from "@threlte/extras";
  import { AutoColliders, Collider } from "@threlte/rapier";
  import { isInShop } from "#stores/shopStore";

  const gltf = useGltf("/city-transformed.glb", { dracoLoader: useDraco() });

  let physicsEnabled = $state(false);

  const handleSensorEnter = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;
    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player entered shop sensor area");
      physicsEnabled = true;
    }
  };

  const handleSensorExit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player exited shop sensor area");
      physicsEnabled = false;
    }
  };

  const handleInteriorEnter = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player") {
      console.log("Player entered interior - closer camera view");
      isInShop.set(true);
    }
  };

  const handleInteriorExit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player") {
      console.log("Player exited interior - normal camera view");
      isInShop.set(false);
    }
  };
</script>

{#await gltf then gltf}
  <T.Group position={[-15.19, 3.15, 40.34]}>
    <T.Group position={[0, 0, -0.1]}>
      <Collider
        onsensorenter={handleSensorEnter}
        onsensorexit={handleSensorExit}
        sensor
        shape="cuboid"
        args={[12, 8, 12]}
      />
    </T.Group>

    <T.Group position={[0.19, -2.95, 4.67]}>
      <T.Mesh
        geometry={gltf.nodes.interior.geometry}
        material={gltf.materials["Material.082"]}
      />

      <T.Group position={[0, 1, 0]}>
        <Collider
          onsensorenter={handleInteriorEnter}
          onsensorexit={handleInteriorExit}
          sensor
          shape="cuboid"
          args={[6.8, 2, 4.7]}
        />
      </T.Group>
    </T.Group>

    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.banquetas008.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[11.1, -3.05, 0.03]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas009.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[0.2, -3.05, 10.41]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas010.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-10.71, -3.05, 0.03]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.banquetas008.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[11.1, -3.05, 0.03]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas009.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[0.2, -3.05, 10.41]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas010.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-10.71, -3.05, 0.03]}
      />
    {/if}

    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.stand1.geometry}
          material={gltf.materials["Material.133"]}
          position={[0.19, -2.4, 8.66]}
        />
        <T.Mesh
          geometry={gltf.nodes.stand2.geometry}
          material={gltf.materials["Material.133"]}
          position={[4.19, -2.12, 4.66]}
        />
        <T.Mesh
          geometry={gltf.nodes.stand2005.geometry}
          material={gltf.materials["Material.133"]}
          position={[-3.82, -2.12, 4.66]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.stand1.geometry}
        material={gltf.materials["Material.133"]}
        position={[0.19, -2.4, 8.66]}
      />
      <T.Mesh
        geometry={gltf.nodes.stand2.geometry}
        material={gltf.materials["Material.133"]}
        position={[4.19, -2.12, 4.66]}
      />
      <T.Mesh
        geometry={gltf.nodes.stand2005.geometry}
        material={gltf.materials["Material.133"]}
        position={[-3.82, -2.12, 4.66]}
      />
    {/if}

    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Group position={[-7.41, -2.08, 4.81]}>
          <T.Mesh
            geometry={gltf.nodes.trash1_1.geometry}
            material={gltf.materials["Material.002"]}
          />
          <T.Mesh
            geometry={gltf.nodes.trash1_2.geometry}
            material={gltf.materials["Material.018"]}
          />
        </T.Group>
        <T.Group position={[7.77, -2.08, 4.81]}>
          <T.Mesh
            geometry={gltf.nodes.trash2_1.geometry}
            material={gltf.materials["Material.002"]}
          />
          <T.Mesh
            geometry={gltf.nodes.trash2_2.geometry}
            material={gltf.materials["Material.018"]}
          />
        </T.Group>
      </AutoColliders>
    {:else}
      <T.Group position={[-7.41, -2.08, 4.81]}>
        <T.Mesh
          geometry={gltf.nodes.trash1_1.geometry}
          material={gltf.materials["Material.002"]}
        />
        <T.Mesh
          geometry={gltf.nodes.trash1_2.geometry}
          material={gltf.materials["Material.018"]}
        />
      </T.Group>
      <T.Group position={[7.77, -2.08, 4.81]}>
        <T.Mesh
          geometry={gltf.nodes.trash2_1.geometry}
          material={gltf.materials["Material.002"]}
        />
        <T.Mesh
          geometry={gltf.nodes.trash2_2.geometry}
          material={gltf.materials["Material.018"]}
        />
      </T.Group>
    {/if}

    {#if physicsEnabled}
      <AutoColliders shape="trimesh">
        <T.Mesh
          geometry={gltf.nodes.shop_1.geometry}
          material={gltf.materials["Material.002"]}
        />

        <T.Mesh
          geometry={gltf.nodes.shop_2.geometry}
          material={gltf.materials["Material.001"]}
        />
        <T.Mesh
          geometry={gltf.nodes.techo_shop.geometry}
          material={gltf.materials["Material.002"]}
          position={[0.19, 2.05, 2.32]}
        />
        <T.Mesh
          geometry={gltf.nodes.Algorand_Ground.geometry}
          material={gltf.materials["Material.082"]}
          position={[-1.02, -2.99, -2.43]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.shop_1.geometry}
        material={gltf.materials["Material.002"]}
      />

      <T.Mesh
        geometry={gltf.nodes.shop_2.geometry}
        material={gltf.materials["Material.001"]}
      />
      <T.Mesh
        geometry={gltf.nodes.techo_shop.geometry}
        material={gltf.materials["Material.002"]}
        position={[0.19, 2.05, 2.32]}
      />
      <T.Mesh
        geometry={gltf.nodes.Algorand_Ground.geometry}
        material={gltf.materials["Material.082"]}
        position={[-1.02, -2.99, -2.43]}
      />
    {/if}
    <T.Mesh
      geometry={gltf.nodes.ventanas_shop.geometry}
      material={gltf.materials["Material.067"]}
      position={[0.19, -0.75, -0.24]}
    /> -->
  </T.Group>
{/await}
