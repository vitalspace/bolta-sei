<script>
  import { rotate } from "three/src/nodes/TSL.js";
  import House from "./House.svelte";

  const positions = [
    {
      position: [-99.57, 3.67, -70.04],
      rotation: [0, 0, 0],
    },
    {
      position: [-69.57, 3.67, -70.04],
      rotation: [0, 0, 0],
    },
    {
      position: [-40.42, 3.67, -69.96],
      rotation: [0, Math.PI, 0],
    },
    {
      position: [-19.57, 3.67, -70.04],
      rotation: [0, 0, 0],
    },
    {
      position: [19.58, 3.67, -70.04],
      rotation: [0, Math.PI, 0],
    },
    {
      position: [40.43, 3.67, -70.04],
      rotation: [0, 0, 0],
    },
    {
      position: [69.58, 3.67, -69.96],
      rotation: [0, Math.PI, 0],
    },
    {
      position: [98.08, 3.67, -69.96],
      rotation: [0, Math.PI, 0],
    },

    {
      position: [-19.57, 3.67, 70.04],
      rotation: [0, 0, 0],
    },

    {
      position: [19.58, 3.67, 70.12],
      rotation: [0, Math.PI, 0],
    },
    {
      position: [40.43, 3.67, 70.04],
      rotation: [0, 0, 0],
    },

    {
      position: [69.57, 3.67, 70.12],
      rotation: [0, Math.PI, 0],
    },
    {
      position: [98.08, 3.67, 70.12],
      rotation: [0, Math.PI, 0],
    },
  ];
</script>

{#each positions as { position, rotation }}
  <House {position} {rotation} />
{/each}
