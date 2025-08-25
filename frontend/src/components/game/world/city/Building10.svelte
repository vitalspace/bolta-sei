<script lang="ts">
  import { useDraco, useGltf } from "@threlte/extras";
  import { items as image } from "#lib/utils/imagenTexture";
  import { items } from "#lib/utils/videoTexture";
  import { T } from "@threlte/core";
  import { AutoColliders, Collider } from "@threlte/rapier";

  const gltf = useGltf("/city-transformed.glb", { dracoLoader: useDraco() });
</script>

{#await gltf then gltf}
  <T.Mesh
    geometry={gltf.nodes.edificio10.geometry}
    material={gltf.materials["Material.002"]}
    position={[-51.75, 23.53, 3.67]}
  >
    <T.Mesh
      geometry={gltf.nodes.ad_10.geometry}
      material={gltf.materials["Material.001"]}
      position={[-3.25, -3.33, 8.33]}
      rotation={[0, 0, 0]}
    >
      <T.MeshBasicMaterial map={image[7].texture} toneMapped={false} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ad_9.geometry}
      material={gltf.materials["Material.001"]}
      position={[6.25, 6.67, -3.67]}
      rotation={[0, 0, -Math.PI]}
    >
      <T.MeshBasicMaterial map={items[5].texture} toneMapped={false} />
    </T.Mesh>

    <AutoColliders shape="cuboid">
      <T.Mesh
        geometry={gltf.nodes.banquetas019.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-24.11, -23.43, -3.67]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas020.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-3.24, -23.43, 17.08]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas021.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-3.24, -23.43, -24.42]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas022.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[17.63, -23.43, -3.67]}
      />
    </AutoColliders>

    <T.Mesh
      geometry={gltf.nodes.Mesh188_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[-22.8, -23.33, -21.27]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh189_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[-22.8, -23.33, 13.93]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh196_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[16.3, -23.33, -21.27]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh190_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[16.3, -23.33, 13.93]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh191_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[16.3, -23.33, 5.96]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh192_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[16.25, -23.33, 3.21]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh193_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[16.25, -23.33, -3.67]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh194_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[16.25, -23.33, -10.54]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh199_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[-22.75, -23.33, -10.54]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh195_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[16.25, -23.33, -13.29]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh198_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[-22.75, -23.33, -13.29]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh200_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[-22.75, -23.33, -3.67]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh201_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[-22.75, -23.33, 3.21]}
    />
    <T.Mesh
      geometry={gltf.nodes.Mesh202_Model.geometry}
      material={gltf.materials["FrontColor.001"]}
      position={[-22.75, -23.33, 5.96]}
    />
    <T.Group position={[-3.25, -20.22, -3.67]}>
      <Collider shape="cuboid" args={[19.1, 3, 20]}>
        <T.Mesh
          position={[0, 1, 0]}
          geometry={gltf.nodes.Mesh92_Group40_Model.geometry}
          material={gltf.materials["Material.002"]}
        />
      </Collider>
    </T.Group>
    <T.Group position={[-3.25, -18.31, -3.67]}>
      <T.Mesh
        geometry={gltf.nodes
          .Mesh94_G_3DGeom_24_5_G_3DGeom_24_4_G_3DGeom_24_3_Assembly_73_1__1
          .geometry}
        material={gltf.materials["Material.076"]}
      />
      <T.Mesh
        geometry={gltf.nodes
          .Mesh94_G_3DGeom_24_5_G_3DGeom_24_4_G_3DGeom_24_3_Assembly_73_1__2
          .geometry}
        material={gltf.materials["Material.077"]}
      />
    </T.Group>
  </T.Mesh>
{/await}
