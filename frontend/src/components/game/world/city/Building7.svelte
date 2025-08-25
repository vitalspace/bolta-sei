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
  const gltf = useGltf("/city-transformed.glb", { dracoLoader: useDraco() });

  // Variables para el sensor
  let physicsEnabled = $state(false);
  let playerNearBuilding = $state(false);

  const handleSensorEnter = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player entered Building7 sensor area");
      playerNearBuilding = true;
      physicsEnabled = true;
    }
  };

  const handleSensorExit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player" || userData?.name === "Car") {
      console.log("Player exited Building7 sensor area");
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
      
      // Paleta con colores dorados y variados
      vec3 baseColor = vec3(0.2 + vPosition.y * 0.8, 0.4 + vUv.x * 0.6, 0.8 + vUv.y * 0.2);
      vec3 accentColor = vec3(1.0, 0.3 + sin(vPosition.y * 0.5) * 0.3, 0.6);
      vec3 goldColor = vec3(1.0, 0.8 + sin(vPosition.y * 1.5) * 0.2, 0.2 + cos(vUv.x * 3.14) * 0.3);
      
      // Mezcla dinámica entre los tres colores
      float mixFactor1 = sin(vPosition.y * 2.0) * 0.5 + 0.5;
      float mixFactor2 = cos(vPosition.y * 1.5 + vUv.x * 2.0) * 0.5 + 0.5;
      
      vec3 tempColor = mix(baseColor, accentColor, mixFactor1);
      vec3 color = mix(tempColor, goldColor, mixFactor2 * 0.7) * 3.2;
      
      vec3 coloredLines = (color * colorFadeTimer * lineFill);
      vec3 final = mix(coloredLines, vec3(lineFill * 0.15), 1. - circle * colorFadeTimer);
      
      gl_FragColor = vec4(final, 1.0);
    }
  `;

  // Función para generar posición aleatoria cerca de las ventanas
  function generateRandomPulseNearWindows() {
    pulsePosition.set(15.01, 16.16, 39.59);
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
  <T.Group position={[15.01, 30, 39.59]}>
    <!-- Sensor de proximidad para detectar al jugador -->
    <T.Group position={[0, -26, 0]}>
      <Collider
        onsensorenter={handleSensorEnter}
        onsensorexit={handleSensorExit}
        sensor
        shape="cuboid"
        args={[12, 4, 12]}
      />
    </T.Group>

    <!-- Edificio principal - solo collider activo cuando el jugador está cerca -->
    <T.Group position={[0, -13.84, 0]}>
      {#if physicsEnabled}
        <AutoColliders shape="cuboid">
          <T.Mesh
            geometry={gltf.nodes.edificio7_1.geometry}
            material={gltf.materials["Material.002"]}
          />
        </AutoColliders>
      {:else}
        <T.Mesh
          geometry={gltf.nodes.edificio7_1.geometry}
          material={gltf.materials["Material.002"]}
        />
      {/if}
      <T.Mesh
        geometry={gltf.nodes.edificio7_2.geometry}
        material={gltf.materials["Material.068"]}
      >
        <MeshLineMaterial
          color="gold"
          linewidth={10}
          dashArray={2}
          dashRatio={1}
          dashOffset={0}
          transparent={false}
          depthTest={true}
        />
      </T.Mesh>

      <T.Mesh
        geometry={gltf.nodes.edificio7_3.geometry}
        material={gltf.materials["Material.069"]}
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
        geometry={gltf.nodes.edificio7_4.geometry}
        material={gltf.materials["Material.001"]}
      >
        <FakeGlowMaterial
          glowColor="#c2044a"
          falloff={1}
          intensity={100}
          depthTest={true}
        />
      </T.Mesh>
    </T.Group>

    <T.Mesh
      geometry={gltf.nodes.casino.geometry}
      material={gltf.nodes.casino.material}
      position={[0.19, -26.11, -9.4]}
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

      <T.PointLight color="yellow" position={[2, 0, -4]} intensity={100} />
      <T.PointLight color="gold" position={[-2, 0, -4]} intensity={100} />
    </T.Mesh>

    <!-- Banquetas - solo collider activo cuando el jugador está cerca -->
    {#if physicsEnabled}
      <AutoColliders shape="cuboid">
        <T.Mesh
          geometry={gltf.nodes.banquetas075.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-10.88, -29.9, 0.41]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas076.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-0.01, -29.9, 11.16]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas077.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[-0.01, -29.9, -10.34]}
        />
        <T.Mesh
          geometry={gltf.nodes.banquetas078.geometry}
          material={gltf.materials["FrontColor.001"]}
          position={[10.86, -29.9, 0.41]}
        />
      </AutoColliders>
    {:else}
      <T.Mesh
        geometry={gltf.nodes.banquetas075.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-10.88, -29.9, 0.41]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas076.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-0.01, -29.9, 11.16]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas077.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[-0.01, -29.9, -10.34]}
      />
      <T.Mesh
        geometry={gltf.nodes.banquetas078.geometry}
        material={gltf.materials["FrontColor.001"]}
        position={[10.86, -29.9, 0.41]}
      />
    {/if}
  </T.Group>
{/await}
