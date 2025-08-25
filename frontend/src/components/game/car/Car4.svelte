<!--
Vehículo controlado por el backend - Solo envía controles
-->

<script lang="ts">
  import { type RigidBody as RapierRigidBody } from "@dimforge/rapier3d-compat";
  import { T, useTask } from "@threlte/core";
  import { MeshLineMaterial, useDraco, useGltf } from "@threlte/extras";
  import {
    Group,
    Vector3,
    Vector2,
    Shape,
    BufferGeometry,
    CustomBlending,
    OneFactor,
    AddEquation,
  } from "three";
  import { Collider, RigidBody } from "@threlte/rapier";
  import { keys, gameState } from "#stores/gameStore";
  import { wsService } from "#websockets/websockets.ts";
  import { ThirdPersonControls } from "../controls/thirdPersonControls";
  import { createCustomExtrudedGeometry } from "./Nitro";

  // Props
  let { carInfo, cameraRef, ...props } = $props();

  // Constants
  const CAR_ID = carInfo.id;
  const ROTATION_SPEED = 10;
  const MAX_ANGULAR_VELOCITY = 15;
  const VELOCITY = {
    NORMAL: 15,
    BOOST: 25,
    REVERSE: -15,
  };
  const CAMERA_CONFIG = {
    offset: new Vector3(0, 1.5, 0),
    targetRadius: 8,
    interpolationFactor: 0.15,
    sensitivity: new Vector2(0.25, 0.25),
    theta: 0,
    phi: -10,
  };

  // Load assets
  const gltf = useGltf("/car-transformed.glb", { dracoLoader: useDraco() });

  // Create geometry once
  const shape = new Shape();
  shape.moveTo(0, 0.2);
  shape.lineTo(-0.5, -0.35);
  shape.lineTo(0.5, -0.35);
  shape.lineTo(0, 0.2);
  const geometry: BufferGeometry = createCustomExtrudedGeometry(shape, 2, 0);

  // State
  let mainGroupRef: Group | undefined = $state<Group>();
  let rigidBody: RapierRigidBody | undefined = $state<RapierRigidBody>();
  let objectRef: Group | undefined = $state<Group>();
  let controls: ThirdPersonControls | undefined;
  let eKeyPressed = $state(false);
  let playerNearThisVehicle = $state(false);
  let enteringVehicle = $state(false);
  let groundContacts = $state(1);
  let isOnGround = $state(true);

  // Helper functions
  const isDriverOfThisVehicle = () =>
    $gameState.controlMode === "vehicle" &&
    $gameState.player.currentVehicle === CAR_ID;

  const canEnterVehicle = () =>
    $gameState.player.canEnterVehicle &&
    $gameState.controlMode === "player" &&
    $gameState.player.nearVehicleId === CAR_ID &&
    playerNearThisVehicle &&
    !carInfo.driverId &&
    !enteringVehicle;

  const registerVehicleControls = () => {
    if (!cameraRef || controls || !mainGroupRef) return false;

    controls = new ThirdPersonControls(cameraRef, mainGroupRef, CAMERA_CONFIG);
    $gameState.controls.vehicles.set(CAR_ID, controls);
    return true;
  };

  const cleanupVehicleControls = () => {
    if (controls) {
      $gameState.controls.vehicles.delete(CAR_ID);
      controls = undefined;
    }
  };

  const updateGroundStatus = (increment: boolean) => {
    groundContacts = Math.max(0, groundContacts + (increment ? 1 : -1));
    isOnGround = groundContacts > 0;

    if (isDriverOfThisVehicle()) {
      $gameState.vehicleStatus.isOnGround = isOnGround;
      $gameState.vehicleStatus.groundContacts = groundContacts;
    }
  };

  const calculateVelocity = () => {
    if ($keys.w.isPressed) {
      return $keys.shift.isPressed ? VELOCITY.BOOST : VELOCITY.NORMAL;
    }
    return $keys.s.isPressed ? VELOCITY.REVERSE : 0;
  };

  const calculateRotation = (cameraRef: any, objectRef: Group) => {
    const v3 = new Vector3();
    const cameraDirection = cameraRef.getWorldDirection(v3);
    const thetaCamera = Math.atan2(cameraDirection.x, cameraDirection.z);
    const objectDirection = objectRef.getWorldDirection(v3);
    const thetaObject = Math.atan2(objectDirection.x, objectDirection.z);

    let deltaTheta = thetaCamera - thetaObject;
    if (deltaTheta > Math.PI) deltaTheta -= Math.PI * 2;
    if (deltaTheta < -Math.PI) deltaTheta += Math.PI * 2;

    const angularVelocityY = deltaTheta * ROTATION_SPEED;
    return (
      Math.sign(angularVelocityY) *
      Math.min(Math.abs(angularVelocityY), MAX_ANGULAR_VELOCITY)
    );
  };

  const updateVehiclePhysics = (
    rigidBody: RapierRigidBody,
    velocity: number,
    angularVelocity: number,
    thetaCamera: number
  ) => {
    rigidBody.setAngvel({ x: 0, y: angularVelocity, z: 0 }, true);

    if (velocity !== 0) {
      const x = Math.sin(thetaCamera) * velocity;
      const z = Math.cos(thetaCamera) * velocity;
      const currentVel = rigidBody.linvel();
      rigidBody.setLinvel({ x, y: currentVel.y, z }, true);
    }
  };

  const syncWithBackend = (rigidBody: RapierRigidBody, mainGroupRef: Group) => {
    const pos = carInfo.position;
    const rot = carInfo.rotation;

    rigidBody.setTranslation({ x: pos.x, y: pos.y, z: pos.z }, true);
    rigidBody.setRotation({ w: rot.w, x: rot.x, y: rot.y, z: rot.z }, true);
    mainGroupRef.position.set(pos.x, pos.y, pos.z);
    mainGroupRef.quaternion.set(rot.x, rot.y, rot.z, rot.w);
  };

  const syncFromLocal = (rigidBody: RapierRigidBody, mainGroupRef: Group) => {
    const localPos = rigidBody.translation();
    const localRot = rigidBody.rotation();

    mainGroupRef.position.set(localPos.x, localPos.y, localPos.z);
    mainGroupRef.quaternion.set(localRot.x, localRot.y, localRot.z, localRot.w);
  };

  // WebSocket message handler
  $effect(() => {
    const unsubscribe = wsService.messages.subscribe((msg: any) => {
      if (msg?.type === "vehicleEnterSuccess" && msg?.vehicleId === CAR_ID) {
        enteringVehicle = false;
      } else if (
        msg?.type === "vehicleExitSuccess" &&
        msg.vehicleId === CAR_ID
      ) {
        cleanupVehicleControls();

        $gameState.controlMode = "player";
        $gameState.player = {
          ...$gameState.player,
          isInVehicle: false,
          currentVehicle: undefined,
          isVisible: true,
          canEnterVehicle: false,
          nearVehicleId: undefined,
          exitPosition: msg.exitPosition,
        };
      }
    });
    return unsubscribe;
  });

  // Main update loop
  useTask(() => {
    if (!rigidBody || !mainGroupRef || !objectRef) return;

    // Handle vehicle entry/exit
    if ($keys.e.isPressed && !eKeyPressed) {
      eKeyPressed = true;

      if (canEnterVehicle()) {
        if (!registerVehicleControls()) return;

        enteringVehicle = true;
        wsService.send({ type: "vehicleEnter", vehicleId: CAR_ID });
      } else if (isDriverOfThisVehicle()) {
        playerNearThisVehicle = false;

        const vehiclePos = rigidBody.translation();
        wsService.send({
          type: "vehicleExit",
          vehicleId: CAR_ID,
          exitPosition: {
            x: vehiclePos.x + 3,
            y: Math.max(vehiclePos.y + 1, 1),
            z: vehiclePos.z,
          },
        });
      }
    } else if (!$keys.e.isPressed) {
      eKeyPressed = false;
    }

    // Handle vehicle controls and sync
    if (isDriverOfThisVehicle() && cameraRef && objectRef) {
      // Calculate movement
      const v3 = new Vector3();
      const cameraDirection = cameraRef.getWorldDirection(v3);
      const thetaCamera = Math.atan2(cameraDirection.x, cameraDirection.z);
      const angularVelocity = calculateRotation(cameraRef, objectRef);
      const velocity = calculateVelocity();

      // Apply physics
      updateVehiclePhysics(rigidBody, velocity, angularVelocity, thetaCamera);

      // Get real physics state
      const realPos = rigidBody.translation();
      const realRot = rigidBody.rotation();
      const realVel = rigidBody.linvel();
      const realAngVel = rigidBody.angvel();

      // Send to backend
      wsService.send({
        type: "vehicleControls",
        vehicleId: CAR_ID,
        controls: {
          w: $keys.w.isPressed,
          s: $keys.s.isPressed,
          shift: $keys.shift.isPressed,
          cameraDirection: thetaCamera,
          angularVelocity,
          velocity,
          isOnGround,
          realPosition: { x: realPos.x, y: realPos.y, z: realPos.z },
          realRotation: {
            x: realRot.x,
            y: realRot.y,
            z: realRot.z,
            w: realRot.w,
          },
          realVelocity: { x: realVel.x, y: realVel.y, z: realVel.z },
          realAngularVelocity: {
            x: realAngVel.x,
            y: realAngVel.y,
            z: realAngVel.z,
          },
        },
      });

      // Update local position
      syncFromLocal(rigidBody, mainGroupRef);

      // Update camera
      controls?.update(0, 0);
    } else if (!isDriverOfThisVehicle()) {
      // Sync from backend for other drivers
      syncWithBackend(rigidBody, mainGroupRef);
    }
  });

  // Collision handlers
  const handleSensorEnter = (event: any) => {
    if (event.targetRigidBody.userData?.name === "player") {
      playerNearThisVehicle = true;
      $gameState.player = {
        ...$gameState.player,
        canEnterVehicle: true,
        nearVehicleId: CAR_ID,
      };
    }
  };

  const handleSensorExit = (event: any) => {
    if (event.targetRigidBody.userData?.name === "player") {
      playerNearThisVehicle = false;
      $gameState.player = {
        ...$gameState.player,
        canEnterVehicle: false,
        nearVehicleId: undefined,
      };
    }
  };

  // Mesh configurations for car parts
  const carMeshes = [
    { name: "car", material: "Material.002", color: carInfo.color },
    { name: "glass", material: "FrontColor.001", color: "white" },
    { name: "side_light", material: "FrontColor.001", color: "cyan" },
    { name: "front_light", material: "FrontColor.001", color: "purple" },
    { name: "stop_light_1", material: "FrontColor.001", color: "orange" },
    { name: "nitro", material: "FrontColor.001", color: "#6355df" },
    { name: "stop_light_2", material: "FrontColor.001", color: "orange" },
    { name: "stop_light_3", material: "FrontColor.001", color: "red" },
    { name: "plate", material: "FrontColor.001", color: "#6355df" },
  ];
</script>

<T.Group dispose={false} {...props}>
  {#await gltf}
    <!-- Fallback mesh -->
    <T.Mesh>
      <T.BoxGeometry args={[2, 1, 4]} />
      <T.MeshStandardMaterial color={carInfo.color} />
    </T.Mesh>
  {:then gltf}
    <T.Group name="Car" bind:ref={mainGroupRef} dispose={false}>
      <RigidBody
        bind:rigidBody
        enabledRotations={[false, true, false]}
        userData={{ name: "Car", id: CAR_ID }}
      >
        <!-- Player detection sensor -->
        <Collider
          onsensorenter={handleSensorEnter}
          onsensorexit={handleSensorExit}
          sensor
          shape="cuboid"
          args={[2, 1, 2.5]}
        />

        <!-- Main collision body -->
        <Collider
          shape="cuboid"
          args={[1, 0.5, 2]}
        >
          <T.Group position={[0, -0.5, -0.4]} bind:ref={objectRef}>
            <!-- Nitro effect -->
            <T.Mesh
              {geometry}
              position={[0, 1.35, -1]}
              rotation={[0, Math.PI, 0]}
            >
              <T.MeshBasicMaterial
                color="red"
                transparent={true}
                opacity={0.5}
                blending={CustomBlending}
                blendDst={OneFactor}
                blendEquation={AddEquation}
              />
            </T.Mesh>

            <!-- Car parts -->
            {#each carMeshes as mesh}
              <T.Mesh
                geometry={gltf.nodes[mesh.name].geometry}
                material={gltf.materials[mesh.material]}
                position={[0, 0.84, 0]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <MeshLineMaterial color={mesh.color} linewidth={0.1} />
              </T.Mesh>
            {/each}
          </T.Group>
        </Collider>
      </RigidBody>
    </T.Group>
  {:catch}
    <!-- Error fallback -->
    <T.Mesh>
      <T.BoxGeometry args={[2, 1, 4]} />
      <T.MeshStandardMaterial color="red" />
    </T.Mesh>
  {/await}
</T.Group>
