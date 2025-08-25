<script lang="ts">
  import { T, useTask } from "@threlte/core";
  import { FakeGlowMaterial } from "@threlte/extras";
  import { AutoColliders } from "@threlte/rapier";
  // import { useWallet } from "../../../hooks/useWallet";
  import { keys } from "#stores/gameStore";
  // import { walletModalService } from "../../../stores/walletModalStore";
  // import { aiAgentService, AGENT_CONTEXTS } from "../../../stores/aiAgentStore";

  // const { isConnected } = useWallet();

  let isOnCheckPoint = $state(false);
  let wasEPressed = $state(false);

  const onsensorenter = async (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player") {
      // console.log("Player entered ads checkpoint");
      isOnCheckPoint = true;
    }
  };

  const onsensorexit = (event: any) => {
    const { targetRigidBody } = event;
    const userData = targetRigidBody.userData;

    if (userData?.name === "player") {
      console.log("Player exited ads checkpoint");
      isOnCheckPoint = false;
    }
  };

  const showAIAgent = () => {
    console.log("🤖 Showing AI Agent with Ads context");
    // aiAgentService.show(AGENT_CONTEXTS.ads);
  };

  // useTask(() => {
  //   // Solo activar cuando se presiona E por primera vez (edge detection)
  //   if ($keys.e.isPressed && !wasEPressed && isOnCheckPoint) {
  //     console.log("E pressed in checkpoint, connected:", $isConnected);

  //     if (!$isConnected) {
  //       // Usuario no conectado - mostrar mensaje para conectar wallet
  //       walletModalService.show({
  //         title: "Conecta tu Wallet",
  //         message:
  //           "Para crear anuncios en la blockchain necesitas conectar tu wallet de MetaMask",
  //         onConnected: () => {
  //           console.log("Wallet conectada, abriendo agente AI");
  //           setTimeout(() => {
  //             showAIAgent();
  //           }, 100);
  //         },
  //       });
  //     } else {
  //       // Usuario conectado - mostrar agente AI directamente
  //       showAIAgent();
  //     }
  //   }

  //   // Actualizar el estado anterior de la tecla E
  //   wasEPressed = $keys.e.isPressed;
  // });
</script>

<!-- glowColor={$isConnected ? "#10b981" : "#3a1994"} -->

<T.Group position={[0, 0.7, 0]}>
  <AutoColliders sensor shape="cuboid" {onsensorenter} {onsensorexit}>
    <T.Mesh>
      <T.CylinderGeometry args={[1.5, 1.5, 1, 32]} />
      <FakeGlowMaterial
        falloff={1}
        glowInternalRadius={0.1}
        glowSharpness={5}
        depthTest={true}
      />
    </T.Mesh>
  </AutoColliders>
</T.Group>
