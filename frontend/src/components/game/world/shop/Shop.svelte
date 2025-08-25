<script lang="ts">
  import { T } from "@threlte/core";
  import { useDraco, useGltf, MeshLineMaterial } from "@threlte/extras";
  import { AutoColliders, Collider } from "@threlte/rapier";
  import ShopPhysics from "./ShopPhysics.svelte";
  // import { isInShop } from "#stores/shopStore";

  const gltf = useGltf("/city-transformed.glb", { dracoLoader: useDraco() });
  import CheckPoints from "./CheckPoints.svelte";
</script>

<CheckPoints />
<ShopPhysics />

{#await gltf then gltf}
  <T.Group position={[-15.19, 3.15, 40.34]}>
    <!-- <T.Mesh
      geometry={gltf.nodes.shop_1.geometry}
      material={gltf.materials["Material.002"]}
    /> -->
    <!-- <T.Mesh
      geometry={gltf.nodes.shop_2.geometry}
      material={gltf.materials["Material.001"]}
    /> -->
    <T.Mesh
      geometry={gltf.nodes.sei.geometry}
      position={[0.19, 3.05, -0.58]}
      rotation={[Math.PI / 2, 0, Math.PI]}
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

      <T.Mesh position={[0, 0.05, -0]}>
        <!-- <T.BoxGeometry args={[0.009, 0.009, 0.009]} /> -->
        <T.PointLight color="#6200ff" intensity={100} position={[0, 0, 0]} />
      </T.Mesh>
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.sei003.geometry}
      position={[0.19, 0.6, 9.61]}
      rotation={[Math.PI / 2, 0, Math.PI]}
      scale={[141.84, 6.08, 141.51]}
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

      <T.Mesh position={[0, 0.1, -0]}>
        <!-- <T.BoxGeometry args={[0.009, 0.009, 0.009]} /> -->
        <T.PointLight color="#6200ff" intensity={100} position={[0, 0, 0]} />
      </T.Mesh>

      <T.Mesh position={[0.028, 0.3, -0]}>
        <!-- <T.BoxGeometry args={[0.009, 0.009, 0.009]} /> -->
        <T.PointLight color="cyan" intensity={100} position={[0, 0, 0]} />
      </T.Mesh>

      <T.Mesh position={[-0.028, 0.3, -0]}>
        <!-- <T.BoxGeometry args={[0.009, 0.009, 0.009]} /> -->
        <T.PointLight color="cyan" intensity={100} position={[0, 0, 0]} />
      </T.Mesh>
    </T.Mesh>
    <!-- <T.Mesh
      geometry={gltf.nodes.Algorand_Ground.geometry}
      material={gltf.materials["Material.082"]}
      position={[-1.02, -2.99, -2.43]}
    /> -->
    <T.Group
      position={[4.34, -1.36, 3.6]}
      rotation={[0, 0, -Math.PI / 2]}
      scale={0.12}
    >
      <T.Mesh
        geometry={gltf.nodes.arma_1_1.geometry}
        material={gltf.materials["Material.032"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arma_1_2.geometry}
        material={gltf.materials["Material.050"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arma_1_3.geometry}
        material={gltf.materials["Material.051"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arma_1_4.geometry}
        material={gltf.materials["Material.053"]}
      />
    </T.Group>
    <T.Group
      position={[4.4, -1.36, 4.63]}
      rotation={[0, 0, -Math.PI / 2]}
      scale={0.1}
    >
      <T.Mesh
        geometry={gltf.nodes.arma_2_1.geometry}
        material={gltf.materials["Material.098"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arma_2_2.geometry}
        material={gltf.materials["Material.099"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arma_2_3.geometry}
        material={gltf.materials["Material.050"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arma_2_4.geometry}
        material={gltf.materials["Material.053"]}
      />
    </T.Group>
    <T.Group
      position={[4.25, -1.35, 5.68]}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[0.25, 0.2, 0.25]}
    >
      <T.Mesh
        geometry={gltf.nodes.arma_3_1.geometry}
        material={gltf.materials["Material.098"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arma_3_2.geometry}
        material={gltf.materials["Material.093"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arma_3_3.geometry}
        material={gltf.materials["Material.094"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arma_3_4.geometry}
        material={gltf.materials["Material.050"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arma_3_5.geometry}
        material={gltf.materials["Material.053"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arma_3_6.geometry}
        material={gltf.materials["Material.097"]}
      />
    </T.Group>
    <T.Group
      position={[-3.51, -1.35, 3.69]}
      rotation={[Math.PI, 0, Math.PI / 2]}
      scale={0.3}
    >
      <T.Mesh
        geometry={gltf.nodes.arma_4_1.geometry}
        material={gltf.materials["Material.118"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arma_4_2.geometry}
        material={gltf.materials["Material.119"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arma_4_3.geometry}
        material={gltf.materials["Material.050"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arma_4_4.geometry}
        material={gltf.materials["Material.121"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arma_4_5.geometry}
        material={gltf.materials["Material.122"]}
      />
    </T.Group>
    <T.Group
      position={[-3.8, -1.37, 5.67]}
      rotation={[Math.PI, 0, Math.PI / 2]}
      scale={0.04}
    >
      <T.Mesh
        geometry={gltf.nodes.arma_5_1.geometry}
        material={gltf.materials["Material.098"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arma_5_2.geometry}
        material={gltf.materials["Material.099"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arma_5_3.geometry}
        material={gltf.materials["Material.050"]}
      />
      <T.Mesh
        geometry={gltf.nodes.arma_5_4.geometry}
        material={gltf.materials["Material.053"]}
      />
    </T.Group>
    <!-- <T.Mesh
      geometry={gltf.nodes.banquetas008.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[11.1, -3.05, 0.03]}
    /> -->
    <!-- <T.Mesh
      geometry={gltf.nodes.banquetas009.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[0.2, -3.05, 10.41]}
    /> -->
    <!-- <T.Mesh
      geometry={gltf.nodes.banquetas010.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[-10.71, -3.05, 0.03]}
    /> -->
    <T.Mesh
      geometry={gltf.nodes.boltaworldadd.geometry}
      material={gltf.materials["downloadedImage (15)"]}
      position={[7.09, 0.86, 4.46]}
      rotation={[Math.PI / 2, 0, Math.PI / 2]}
      scale={[2.03, 1, 1.89]}
    />
    <T.Group
      position={[0.19, 1.46, 9.22]}
      rotation={[2.56, -0.7, 2.74]}
      scale={0.2}
    >
      <T.Mesh
        geometry={gltf.nodes.Bosinas_1.geometry}
        material={gltf.materials["Material.001"]}
      />
      <T.Mesh
        geometry={gltf.nodes.Bosinas_2.geometry}
        material={gltf.materials["Material.002"]}
      />
    </T.Group>
    <T.Mesh
      geometry={gltf.nodes.car.geometry}
      material={gltf.materials["Material.134"]}
      position={[-2.44, -1.47, 8.69]}
      rotation={[Math.PI / 2, 0, Math.PI]}
      scale={0.3}
    >
      <T.Mesh
        geometry={gltf.nodes.front_light001.geometry}
        material={gltf.materials.FrontColor}
        position={[-0.04, 2.32, 0.4]}
      />
      <T.Mesh
        geometry={gltf.nodes.glass001.geometry}
        material={gltf.materials.FrontColor}
        position={[-0.04, 1.96, 0.03]}
      />
      <T.Mesh
        geometry={gltf.nodes.nitro001.geometry}
        material={gltf.materials.FrontColor}
        position={[-0.04, -1.34, -0.44]}
      />
      <T.Mesh
        geometry={gltf.nodes.plate001.geometry}
        material={gltf.materials.FrontColor}
        position={[-0.04, -1.09, 0.38]}
      />
      <T.Mesh
        geometry={gltf.nodes.side_light002.geometry}
        material={gltf.materials.FrontColor}
        position={[-0.04, -0.52, 0.23]}
      />
      <T.Mesh
        geometry={gltf.nodes.stop_light_1001.geometry}
        material={gltf.materials.FrontColor}
        position={[-0.04, -1.03, -0.21]}
      />
      <T.Mesh
        geometry={gltf.nodes.stop_light_2001.geometry}
        material={gltf.materials.FrontColor}
        position={[-0.04, -1.3, 0.01]}
      />
      <T.Mesh
        geometry={gltf.nodes.stop_light_3001.geometry}
        material={gltf.materials.FrontColor}
        position={[-0.04, -1.24, 0.14]}
      />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.corona002.geometry}
      material={gltf.materials["Material.134"]}
      position={[0.19, -0.54, 8.64]}
      rotation={[0, Math.PI / 2, 0]}
      scale={[0.15, 0.26, 0.15]}
    />
    <T.Group
      position={[-3.81, 0.45, 9.16]}
      rotation={[0, 1.57, 0]}
      scale={0.14}
    >
      <T.Mesh
        geometry={gltf.nodes.gorro_1_1.geometry}
        material={gltf.materials["Material.027"]}
      />
      <T.Mesh
        geometry={gltf.nodes.gorro_1_2.geometry}
        material={gltf.materials["sei-sei-logo (1)"]}
      />
    </T.Group>
    <T.Group position={[4.19, 0.45, 9.16]} scale={[0.17, 0.25, 0.17]}>
      <T.Mesh
        geometry={gltf.nodes.gorro_2_1.geometry}
        material={gltf.materials["Material.029"]}
      />
      <T.Mesh
        geometry={gltf.nodes.gorro_2_2.geometry}
        material={gltf.materials["sei-sei-logo (1)"]}
      />
    </T.Group>
    <T.Mesh
      geometry={gltf.nodes.guantes_vip002.geometry}
      material={gltf.materials["Material.134"]}
      position={[0.19, -1.37, 8.29]}
      rotation={[0, 1.57, 0]}
    />
    <T.Group position={[2.58, -1.47, 8.61]} scale={0.04}>
      <T.Mesh
        geometry={gltf.nodes.home_1.geometry}
        material={gltf.materials["FrontColor.001"]}
      />
      <T.Mesh
        geometry={gltf.nodes.home_2.geometry}
        material={gltf.materials["Material.031"]}
      />
      <T.Mesh
        geometry={gltf.nodes.home_3.geometry}
        material={gltf.materials["Material.011"]}
      />
      <T.Mesh
        geometry={gltf.nodes.home_4.geometry}
        material={gltf.materials["Material.012"]}
      />
      <T.Mesh
        geometry={gltf.nodes.home_5.geometry}
        material={gltf.materials["Material.031"]}
      />
      <T.Mesh
        geometry={gltf.nodes.home_6.geometry}
        material={gltf.materials["Material.015"]}
      />
      <T.Mesh
        geometry={gltf.nodes.home_7.geometry}
        material={gltf.materials["Material.016"]}
      />
      <T.Mesh
        geometry={gltf.nodes.home_8.geometry}
        material={gltf.materials["Material.106"]}
      />
      <T.Mesh
        geometry={gltf.nodes.home_9.geometry}
        material={gltf.materials["Material.107"]}
      />
    </T.Group>
    <!-- <T.Mesh
      geometry={gltf.nodes.interior.geometry}
      material={gltf.materials["Material.082"]}
      position={[0.19, -2.95, 4.67]}
    /> -->
    <T.Mesh
      geometry={gltf.nodes.lentes_vip002.geometry}
      material={gltf.materials["Material.071"]}
      position={[0.19, -0.72, 8.35]}
      rotation={[Math.PI, 0, Math.PI]}
      scale={0.02}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh87_Group35_Model002.geometry}
      material={gltf.materials["Material.002"]}
      position={[0.19, 0.67, 9.66]}
    />
    <T.Mesh
      geometry={gltf.nodes.Plane.geometry}
      material={gltf.materials["Material.028"]}
      position={[-6.8, 0.86, 4.66]}
      rotation={[0, 0, -Math.PI / 2]}
      scale={0.69}
    />
    <!-- <T.Mesh
      geometry={gltf.nodes.stand1.geometry}
      material={gltf.materials["Material.133"]}
      position={[0.19, -2.4, 8.66]}
    /> -->
    <!-- <T.Mesh
      geometry={gltf.nodes.stand2.geometry}
      material={gltf.materials["Material.133"]}
      position={[4.19, -2.12, 4.66]}
    />
    <T.Mesh
      geometry={gltf.nodes.stand2005.geometry}
      material={gltf.materials["Material.133"]}
      position={[-3.82, -2.12, 4.66]}
    /> -->
    <T.Mesh
      geometry={gltf.nodes.stand2001.geometry}
      material={gltf.materials["Material.133"]}
      position={[-6.31, -0.4, 4.66]}
      scale={[0.5, 0.1, 1]}
    />
    <T.Mesh
      geometry={gltf.nodes.stand2002.geometry}
      material={gltf.materials["Material.133"]}
      position={[6.68, -0.4, 4.66]}
      scale={[0.5, 0.1, 1]}
    />
    <T.Mesh
      geometry={gltf.nodes.stand2003.geometry}
      material={gltf.materials["Material.133"]}
      position={[4.19, -0.4, 9.16]}
      rotation={[0, 1.57, 0]}
      scale={[0.5, 0.1, 0.5]}
    />
    <T.Mesh
      geometry={gltf.nodes.stand2004.geometry}
      material={gltf.materials["Material.133"]}
      position={[-3.81, -0.4, 9.16]}
      rotation={[0, 1.57, 0]}
      scale={[0.5, 0.1, 0.5]}
    />
    <T.Mesh
      geometry={gltf.nodes.suerter_base001.geometry}
      material={gltf.materials["Material.029"]}
      position={[4.19, 0.05, 9.16]}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[0.1, 0.2, 0.1]}
    />
    <T.Mesh
      geometry={gltf.nodes.suerter_base002.geometry}
      material={gltf.materials["Material.124"]}
      position={[-3.81, 0.05, 9.16]}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[0.1, 0.2, 0.1]}
    />
    <T.Mesh
      geometry={gltf.nodes.suerter_base003.geometry}
      material={gltf.materials["Material.125"]}
      position={[6.62, 0.05, 5.83]}
      rotation={[Math.PI / 2, 0, -0.82]}
      scale={[0.1, 0.2, 0.1]}
    />
    <T.Mesh
      geometry={gltf.nodes.suerter_base004.geometry}
      material={gltf.materials["Material.126"]}
      position={[-6.21, 0.05, 5.83]}
      rotation={[Math.PI / 2, 0, 0.75]}
      scale={[0.1, 0.2, 0.1]}
    />
    <T.Mesh
      geometry={gltf.nodes.suerter_base005.geometry}
      material={gltf.materials["Material.134"]}
      position={[0.19, -1.15, 8.64]}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[0.1, 0.2, 0.1]}
    />
    <!-- <T.Mesh
      geometry={gltf.nodes.techo_shop.geometry}
      material={gltf.materials["Material.002"]}
      position={[0.19, 2.05, 2.32]}
    /> -->
    <!--     
    <T.Group position={[-7.41, -2.08, 4.81]}>
      <T.Mesh
        geometry={gltf.nodes.trash1_1.geometry}
        material={gltf.materials["Material.002"]}
      />
      <T.Mesh
        geometry={gltf.nodes.trash1_2.geometry}
        material={gltf.materials["Material.018"]}
      />
    </T.Group> -->

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
    <T.Mesh
      geometry={gltf.nodes.ventanas_shop.geometry}
      material={gltf.materials["Material.067"]}
      position={[0.19, -0.75, -0.24]}
    />
    <T.Mesh
      geometry={gltf.nodes.zapatos_vip002.geometry}
      material={gltf.materials["Material.071"]}
      position={[0.19, -1.79, 8.13]}
      rotation={[0, Math.PI / 2, 0]}
      scale={1.55}
    />
  </T.Group>
{/await}
