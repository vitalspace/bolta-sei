<script>
  import { T } from "@threlte/core";
  import { Stars, OrbitControls } from "@threlte/extras";
  import World from "#components/game/World.svelte";
</script>

<Stars count={1000} depth={200} speed={1} fade />
<T.DirectionalLight position={[0, 10, 10]} castShadow />
<World />

<!-- <T.PerspectiveCamera
  makeDefault
  fov={70}
  position={[0, 200, 0]}
  oncreate={(ref) => {
    ref.lookAt(0, 1, 0);
  }}
>
  <OrbitControls />
</T.PerspectiveCamera> -->
