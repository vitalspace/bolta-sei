<script lang="ts">
  import {
    FakeGlowMaterial,
    Outlines,
    useDraco,
    useGltf,
    MeshLineMaterial,
  } from "@threlte/extras";

  import { T, useTask } from "@threlte/core";

  import { Group } from "three";

  const gltf = useGltf("/city-transformed.glb", { dracoLoader: useDraco() });

  let ref = $state<Group>();
  let time = $state(0);
  let outlineColor = $state("white");

  // Parámetros de flotación
  const floatAmplitude = 2; // Amplitud del movimiento vertical
  const floatSpeed = 1; // Velocidad de flotación
  const swayAmplitude = 3; // Amplitud del balanceo horizontal
  const swaySpeed = 0.3; // Velocidad del balanceo
  const rotationAmplitude = 0.05; // Amplitud de rotación sutil

  // Colores para el outline
  const colors = [
    "#ff6b6b", // Rojo coral
    "#4ecdc4", // Turquesa
    "#45b7d1", // Azul cielo
    "#96ceb4", // Verde menta
    "#ffeaa7", // Amarillo suave
    "#dda0dd", // Violeta
    "#98d8c8", // Verde agua
    "#f7dc6f", // Amarillo dorado
    "#bb8fce", // Púrpura suave
    "#85c1e9", // Azul claro
  ];

  // Función para obtener color aleatorio
  function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  useTask((delta) => {
    if (!ref) return;

    time += delta;

    // Cambiar color del outline cada 2 segundos aproximadamente
    if (Math.floor(time) % 2 === 0 && Math.floor(time * 10) % 20 === 0) {
      outlineColor = getRandomColor();
    }

    const floatY = Math.sin(time * floatSpeed) * floatAmplitude;

    const swayX = Math.sin(time * swaySpeed * 0.7) * swayAmplitude;
    const swayZ = Math.cos(time * swaySpeed * 0.5) * swayAmplitude * 0.5;

    const rotationX = Math.sin(time * swaySpeed * 0.6) * rotationAmplitude;
    const rotationZ = Math.cos(time * swaySpeed * 0.4) * rotationAmplitude;

    ref.position.set(swayX, 40.13 + floatY, swayZ);
    ref.rotation.set(Math.PI / 2 + rotationX, 0, rotationZ);
  });
</script>

{#await gltf then gltf}
  <T.Group
    bind:ref
    position={[0, 40.13, 0]}
    rotation={[Math.PI / 2, 0, 0]}
    scale={[6.55, 6.36, 6.36]}
  >
    <T.Mesh
      geometry={gltf.nodes.globo.geometry}
      material={gltf.nodes.globo.material}
    >
    
      <Outlines color={outlineColor} thickness={0.02} />

      <T.Mesh
        geometry={gltf.nodes.sei002.geometry}
        material={gltf.nodes.sei002.material}
        position={[0.05, 0, -0.13]}
        rotation={[0.12, 0, 0]}
        scale={[69.78, 4.73, 71.65]}
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

        <T.Mesh position={[0, 2, 4]}>
          <T.PointLight color="cyan" position={[0, 0, 2]} intensity={100} />
          <T.PointLight color="blue" position={[0, 0, -0]} intensity={100} />
          <T.PointLight color="cyan" position={[0, 0, 2]} intensity={100} />
        </T.Mesh>

        <T.Mesh position={[0, -2, -2]}>
          <T.PointLight color="cyan" position={[0, 0, 2]} intensity={100} />
          <T.PointLight color="blue" position={[0, 0, -0]} intensity={100} />
          <T.PointLight color="cyan" position={[0, 0, 2]} intensity={100} />
        </T.Mesh>
      </T.Mesh>
    </T.Mesh>
  </T.Group>
{/await}
