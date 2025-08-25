<script lang="ts">
  import Scene from "./Scene.svelte";
  import { Canvas } from "@threlte/core";
  import Loader from "./ui/Loader.svelte";
  import { Studio } from "@threlte/studio";
  import { World, Debug } from "@threlte/rapier";
  let debug = $state(false);
  import Chat from "./ui/chat/Chat.svelte";
  import DashBoardButton from "./ui/dashBoard/dashBoardButton.svelte";
  import YouTubeDialog from "./ui/youtube/YouTubeDialog.svelte";
  import Shop from "./ui/shop/Shop.svelte";
  import AiChat from "./ui/chat/aiChat.svelte";
  import { aiChatStore } from "../stores/aiChatStore";

  let aiChatState = $state({ isOpen: false });
  
  aiChatStore.subscribe(state => {
    aiChatState = state;
  });

</script>

<div class="bg-gray-950 h-screen">
  <!-- <ShopTest/> -->
  <Shop/>
  <YouTubeDialog />
  <Chat />
  <Loader />
  <DashBoardButton />
  
  <!-- AI Chat Modal -->
  {#if aiChatState.isOpen}
    <AiChat />
  {/if}
  
  <!-- AI Chat Button -->
  {#if !aiChatState.isOpen}
    <button 
      class="fixed bottom-4 right-4 bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 border-2 border-cyan-400 hover:border-cyan-300"
      onclick={() => aiChatStore.open()}
      title="Open AI Chat"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a9.863 9.863 0 01-4.906-1.289L3 21l2.289-5.094A9.863 9.863 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"></path>
      </svg>
    </button>
  {/if}
  
  <div class="h-full">
    <Canvas>
      <World>
        {#if debug}
          <Debug />
        {/if}
        <!-- <Studio> -->
        <Scene />
        <!-- </Studio> -->
      </World>
    </Canvas>
  </div>
</div>
