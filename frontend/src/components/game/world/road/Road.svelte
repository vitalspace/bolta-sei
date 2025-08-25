<script lang="ts">
  import { T } from "@threlte/core";
  import { useDraco, useGltf } from "@threlte/extras";
  import { AutoColliders } from "@threlte/rapier";

  const gltf = useGltf("/city-transformed.glb", { dracoLoader: useDraco() });
</script>

{#await gltf then gltf}
  <AutoColliders shape="trimesh">
    <T.Group position={[403.06, 6.51, -1.99]} rotation={[Math.PI / 2, 0, 0]}>
      <T.Mesh
        geometry={gltf.nodes.road_1.geometry}
        material={gltf.materials["Material.001"]}
      />
      <T.Mesh
        geometry={gltf.nodes.road_2.geometry}
        material={gltf.materials["Material.138"]}
      />
    </T.Group>
  </AutoColliders>
{/await}
