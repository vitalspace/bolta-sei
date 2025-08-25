<script lang="ts">
  import {
    FakeGlowMaterial,
    interactivity,
    MeshLineMaterial,
    useDraco,
    useGltf,
  } from "@threlte/extras";

  import { T, useTask } from "@threlte/core";
  import { AutoColliders, Collider } from "@threlte/rapier";
  import { quadOut } from "svelte/easing";
  import { Tween } from "svelte/motion";
  import { Vector3 } from "three";
  import { items } from "#lib/utils/videoTexture";

  const gltf = useGltf("/city-transformed.glb", { dracoLoader: useDraco() });

  // Variables para el sensor
  let physicsEnabled = $state(false);
  let playerNearBuilding = $state(false);

  const handleSensorEnter = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player entered Building4 sensor area");
      playerNearBuilding = true;
      physicsEnabled = true;
    }
  };

  const handleSensorExit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player exited Building4 sensor area");
      playerNearBuilding = false;
      physicsEnabled = false;
    }
  };

  // Variables para el shader
  interactivity();
  const pulsePosition = new Vector3();
  const pulseTimer = new Tween(0, {
    easing: quadOut,
  });

  // Variables para el control de timing
  let lastPulseTime = 0;
  let nextPulseDelay = 3000; // Tiempo inicial
  let isPulseActive = false;

  // Vertex shader
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;
      vUv = uv;
      vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    }
  `;

  // Fragment shader con grid effect
  const fragmentShader = `
    // Credit: https://madebyevan.com/shaders/grid/
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform vec3 pulsePosition;
    uniform float pulseTimer;
    
    void main() {
      float coord = vPosition.y * 2.;
      float line = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
      float lineFill = 1.0 - min(line, 1.0);
      lineFill = pow(lineFill, 1.0 / 2.2);
      
      float circleGrowTimer = min(pulseTimer * 2., 1.);
      float colorFadeTimer = 1. - pulseTimer;
      float circle = 1.0 - smoothstep(0.9 * circleGrowTimer, 1. * circleGrowTimer, length(pulsePosition.xz - vPosition.xz) * 0.05);
      
      // bright colors
      vec3 color = vec3(vPosition.y * 1.5, vUv.x, vUv.y) * 2.5;
      vec3 coloredLines = (color * colorFadeTimer * lineFill);
      vec3 final = mix(coloredLines, vec3(lineFill * 0.1), 1. - circle * colorFadeTimer);
      
      gl_FragColor = vec4(final, 1.0);
    }
  `;

  // Función para generar posición aleatoria cerca de las ventanas
  function generateRandomPulseNearWindows() {
    pulsePosition.set(14.77, 21.69, -52);
  }

  // Función para iniciar un nuevo pulso
  function startNewPulse() {
    if (isPulseActive) return;

    generateRandomPulseNearWindows();
    isPulseActive = true;

    pulseTimer.set(0, { duration: 0 }).then(() => {
      pulseTimer.set(1, { duration: 2000 }).then(() => {
        isPulseActive = false;
        // Programar el siguiente pulso con delay aleatorio
        nextPulseDelay = 3000 + Math.random() * 2000; // Entre 3-5 segundos
      });
    });
  }

  // Usar useTask para el bucle de animación
  useTask(() => {
    const currentTime = performance.now();

    // Iniciar el primer pulso después de 1 segundo
    if (lastPulseTime === 0 && currentTime > 1000) {
      lastPulseTime = currentTime;
      startNewPulse();
    }

    // Comprobar si es hora del siguiente pulso
    if (
      lastPulseTime > 0 &&
      !isPulseActive &&
      currentTime - lastPulseTime > nextPulseDelay
    ) {
      lastPulseTime = currentTime;
      startNewPulse();
    }
  });
</script>

{#await gltf then gltf}
  <T.Group position={[14.8, 34.51, -38.87]}>
    <!-- Sensor de proximidad para detectar al jugador -->
    <T.Group position={[0, -30.5, -1]}>
      <Collider
        onsensorenter={handleSensorEnter}
        onsensorexit={handleSensorExit}
        sensor
        shape="cuboid"
        args={[12, 4, 12]}
      />
    </T.Group>

    <!-- Edificio principal - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="convexHull">
        <T.Mesh
          geometry={gltf.nodes.edificio4.geometry}
          material={gltf.materials["Material.002"]}
          position={[-0.03, -12.82, 0.06]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.edificio4.geometry}
        material={gltf.materials["Material.002"]}
        position={[-0.03, -12.82, 0.06]}
      />
    {/if}

    <T.Mesh
      geometry={gltf.nodes.ad_1.geometry}
      material={gltf.nodes.ad_1.material}
      position={[-4.31, -20.88, -1.13]}
      rotation={[-Math.PI, 0, 0]}
    >
      <T.MeshBasicMaterial map={items[2].texture} toneMapped={false} />
    </T.Mesh>
    <!-- Suelo - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.ground001.geometry}
          material={gltf.materials["Material.001"]}
          position={[0.91, -34.31, -1.85]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.ground001.geometry}
        material={gltf.materials["Material.001"]}
        position={[0.91, -34.31, -1.85]}
      />
    {/if}
    <T.Mesh
      geometry={gltf.nodes.hotel2.geometry}
      material={gltf.nodes.hotel2.material}
      position={[0.53, -29.7, 4.87]}
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

      <T.PointLight color="cyan" position={[0, 0, 0]} intensity={100} />
      <T.PointLight color="blue" position={[0, 0, 0]} intensity={100} />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.luz.geometry}
      material={gltf.nodes.luz.material}
      position={[0.2, -21.14, 2.82]}
    >
      <MeshLineMaterial
        color="#c0fa00"
        linewidth={10}
        dashArray={2}
        dashRatio={1}
        dashOffset={0}
        transparent={false}
        depthTest={true}
      />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.torres.geometry}
      material={gltf.materials["Material.047"]}
      position={[2.98, -26.81, -3.91]}
    >
      <FakeGlowMaterial
        glowColor="cyan"
        falloff={1}
        intensity={100}
        depthTest={true}
      />
    </T.Mesh>

    <T.Mesh
      geometry={gltf.nodes.ventana_1.geometry}
      material={gltf.nodes.ventana_1.material}
      position={[5.65, -10.31, -1.13]}
    >
      <T.ShaderMaterial
        {fragmentShader}
        {vertexShader}
        uniforms={{
          pulseTimer: {
            value: 0,
          },
          pulsePosition: {
            value: 0,
          },
        }}
        uniforms.pulseTimer.value={pulseTimer.current}
        uniforms.pulsePosition.value={pulsePosition}
      />
    </T.Mesh>
    <T.Mesh
      geometry={gltf.nodes.ventana_2.geometry}
      material={gltf.nodes.ventana_2.material}
      position={[-5.25, -9.26, -1.13]}
    >
      <T.ShaderMaterial
        {fragmentShader}
        {vertexShader}
        uniforms={{
          pulseTimer: {
            value: 0,
          },
          pulsePosition: {
            value: 0,
          },
        }}
        uniforms.pulseTimer.value={pulseTimer.current}
        uniforms.pulsePosition.value={pulsePosition}
      />
    </T.Mesh>

    <!-- Banquetas - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.banquetas043.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[0.21, -34.41, 9.62]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas044.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[0.21, -34.41, -11.88]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas065.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[11.08, -34.41, -1.13]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas066.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-10.67, -34.41, -1.13]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.banquetas043.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[0.21, -34.41, 9.62]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas044.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[0.21, -34.41, -11.88]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas065.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[11.08, -34.41, -1.13]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas066.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-10.67, -34.41, -1.13]}
      />
    {/if}
  </T.Group>
{/await}
