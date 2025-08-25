<script lang="ts">
  import {
    FakeGlowMaterial,
    MeshLineMaterial,
    useDraco,
    useGltf,
  } from "@threlte/extras";

  import { items } from "#lib/utils/videoTexture";
  import { T } from "@threlte/core";
  import { Collider } from "@threlte/rapier";

  const gltf = useGltf("/city-transformed.glb", { dracoLoader: useDraco() });
</script>

{#await gltf then gltf}
  <T.Group position={[55, 14.13, -39.97]}>
    <Collider shape="cuboid" args={[20, 14, 10]}>
      <T.Group position={[15, 0, -0.2]}>
        <T.Mesh
          geometry={gltf.nodes.edificio5_1.geometry}
          material={gltf.materials["Material.002"]}
        />
        <T.Mesh
          geometry={gltf.nodes.edificio5_2.geometry}
          material={gltf.materials["Material.001"]}
        >
          <FakeGlowMaterial glowColor="purple" depthTest={true} />
        </T.Mesh>
        <T.Mesh
          geometry={gltf.nodes.ad_2.geometry}
          material={gltf.nodes.ad_2.material}
          position={[-29.99, 12.32, 11.67]}
        >
          <T.MeshBasicMaterial map={items[0].texture} toneMapped={false} />
        </T.Mesh>
        <T.Mesh
          geometry={gltf.nodes.ad_3.geometry}
          material={gltf.nodes.ad_3.material}
          position={[-19.99, -4.63, 10.17]}
        >
          <T.MeshBasicMaterial map={items[1].texture} toneMapped={false} />
        </T.Mesh>
        <T.Mesh
          geometry={gltf.nodes.ad_4.geometry}
          material={gltf.materials["Material.001"]}
          position={[-5.99, -2.05, 9.17]}
          rotation={[0, 0, -Math.PI]}
        >
          <T.MeshBasicMaterial map={items[3].texture} toneMapped={false} />
        </T.Mesh>
        <T.Mesh
          geometry={gltf.nodes.ad_5.geometry}
          material={gltf.materials["Material.001"]}
          position={[4.01, -2.05, 0.17]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <T.MeshBasicMaterial map={items[6].texture} toneMapped={false} />
        </T.Mesh>
        <T.Mesh
          geometry={gltf.nodes.ad_6.geometry}
          material={gltf.materials["Material.001"]}
          position={[-5.99, -2.8, -8.83]}
          rotation={[0, 0, Math.PI / 2]}
          scale={[1, 1.08, 1]}
        >
          <T.MeshBasicMaterial map={items[7].texture} toneMapped={false} />
        </T.Mesh>
        <T.Mesh
          geometry={gltf.nodes.ad_7.geometry}
          material={gltf.materials["Material.001"]}
          position={[-23.33, -6.93, -8.16]}
        >
          <T.MeshBasicMaterial map={items[8].texture} toneMapped={false} />
        </T.Mesh>
        <T.Mesh
          geometry={gltf.nodes.ad_8.geometry}
          material={gltf.nodes.ad_8.material}
          position={[-29.99, 5.32, -1.83]}
        >
          <T.MeshBasicMaterial map={items[9].texture} toneMapped={false} />
        </T.Mesh>
        <T.Mesh
          geometry={gltf.nodes.path1002.geometry}
          material={gltf.nodes.path1002.material}
          position={[-34.99, 17.77, 2.72]}
          rotation={[Math.PI / 2, 0, 1.57]}
          scale={[283.68, 61, 283.02]}
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
          <T.PointLight color="#6200ff" position={[-2, 0, 0]} intensity={100} />
          <T.PointLight color="red" position={[-4, 0, 0]} intensity={100} />
        </T.Mesh>
        <T.Mesh
          geometry={gltf.nodes.hotel_text.geometry}
          material={gltf.nodes.hotel_text.material}
          position={[-29.7, 20.91, 12.3]}
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
          <T.PointLight color="#6200ff" position={[0, 0, 4]} intensity={100} />
          <T.PointLight color="red" position={[0, 0, 2]} intensity={100} />
        </T.Mesh>
        <T.Group position={[-31.24, 4.19, 6.45]}>
          <T.Mesh
            geometry={gltf.nodes.Mesh39_Group20_Model_1.geometry}
            material={gltf.materials["Material.002"]}
          />
          <T.Mesh
            geometry={gltf.nodes.Mesh39_Group20_Model_2.geometry}
            material={gltf.materials["Material.080"]}
          />
          <T.Mesh
            geometry={gltf.nodes.Mesh39_Group20_Model_3.geometry}
            material={gltf.materials["Material.001"]}
          />
        </T.Group>
        <T.Mesh
          geometry={gltf.nodes.Mesh39_Group20_Model003.geometry}
          material={gltf.nodes.Mesh39_Group20_Model003.material}
          position={[-32.49, 19.45, 7.42]}
        ></T.Mesh>
        <T.Mesh
          geometry={gltf.nodes.tube1.geometry}
          material={gltf.nodes.tube1.material}
          position={[-27.54, 11.82, -0.05]}
        >
          <FakeGlowMaterial
            glowColor="cyan"
            falloff={1}
            glowInternalRadius={0.1}
            glowSharpness={5}
            depthTest={true}
          />
        </T.Mesh>
        <T.Mesh
          geometry={gltf.nodes.tube2.geometry}
          material={gltf.nodes.tube2.material}
          position={[-29.93, 9.49, -0.66]}
        >
          <FakeGlowMaterial
            glowColor="purple"
            falloff={1}
            glowInternalRadius={0.1}
            glowSharpness={5}
            depthTest={true}
          />
        </T.Mesh>
        <T.Mesh
          geometry={gltf.nodes.tube3.geometry}
          material={gltf.nodes.tube3.material}
          position={[-30.32, 8.53, 9.37]}
        >
          <FakeGlowMaterial
            glowColor="#5b02f5"
            falloff={1}
            glowInternalRadius={0.1}
            glowSharpness={5}
            depthTest={true}
          />
        </T.Mesh>
        <T.Mesh
          geometry={gltf.nodes.tube4.geometry}
          material={gltf.nodes.tube4.material}
          position={[-26.15, 11.47, 8.92]}
        >
          <FakeGlowMaterial
            glowColor="pink"
            falloff={1}
            glowInternalRadius={0.1}
            glowSharpness={5}
            depthTest={true}
          />
        </T.Mesh>
        <T.Mesh
          geometry={gltf.nodes.tube5.geometry}
          material={gltf.materials["Material.001"]}
          position={[-35.49, 4.82, 7.67]}
        >
          <FakeGlowMaterial
            glowColor="blue"
            falloff={1}
            glowInternalRadius={0.1}
            glowSharpness={5}
            depthTest={true}
          />
        </T.Mesh>
      </T.Group>
    </Collider>
  </T.Group>
{/await}
