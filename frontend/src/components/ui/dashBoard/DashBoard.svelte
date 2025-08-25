<script lang="ts">
  import Clan from "#components/ui/dashBoard/Clan.svelte";
  import Wallet from "#components/ui/dashBoard/Wallet.svelte";
  import WalletAuth from "#components/ui/dashBoard/WalletAuth.svelte";
  import { dashboardService, dashboardStore } from "#stores/dashBoradStore";
  import { TabItem, Tabs } from "flowbite-svelte";
  import { useWallet } from "#hooks/useWallet";
  import { X } from "lucide-svelte";

  const { isConnected } = useWallet();
</script>

{#if $dashboardStore.isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[10001] cyberpunk-overlay"
    onclick={(event) => {
      if (event.target === event.currentTarget) dashboardService.close();
    }}
  >
    <div
      class="bg-gray-900/95 backdrop-blur-xl w-[90%] max-w-2xl h-[80vh] flex flex-col shadow-2xl border border-cyan-500/30 cyberpunk-container"
      onclick={(event) => event.stopPropagation()}
    >
      <div
        class="flex justify-between items-center px-8 py-6 border-b border-cyan-500/30 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-cyan-100 cyberpunk-header"
      >
        <h3
          class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 cyberpunk-title"
        >
          GAME DASHBOARD
        </h3>
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button
          class="group relative w-10 h-10 flex items-center justify-center rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 active:bg-cyan-500/30 transition-all duration-200 transform hover:scale-105 active:scale-95 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400/50 cyberpunk-close-btn"
          onclick={() => dashboardService.close()}
          title="Close dashboard"
        >
          <X
            class="w-5 h-5 text-cyan-400 transition-transform duration-200 group-hover:rotate-90 group-hover:text-cyan-300"
          />
          <div
            class="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 cyberpunk-glow"
          ></div>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto">
        {#if $isConnected}
          <Tabs
            tabStyle="none"
            contentClass="cyberpunk-tab-content"
            class="mx-4 mt-4"
          >
            <TabItem open={true} title="Wallet" tabStyle="none">
              <div
                class="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-200 hover:scrollbar-thumb-gray-700"
              >
                <Wallet />
              </div>
            </TabItem>

            <TabItem title="Clan" tabStyle="none">
              <div class="h-full">
                <Clan />
              </div>
            </TabItem>
          </Tabs>
        {:else}
          <WalletAuth />
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .cyberpunk-overlay {
    background: radial-gradient(
      ellipse at center,
      rgba(6, 182, 212, 0.1) 0%,
      rgba(0, 0, 0, 0.9) 70%
    );
  }

  .cyberpunk-container {
    box-shadow:
      0 0 50px rgba(6, 182, 212, 0.3),
      inset 0 0 50px rgba(6, 182, 212, 0.05),
      0 0 100px rgba(147, 51, 234, 0.2);
    animation: pulse-glow 3s ease-in-out infinite alternate;
  }

  .cyberpunk-header {
    background: linear-gradient(
      135deg,
      rgba(17, 24, 39, 0.95) 0%,
      rgba(31, 41, 55, 0.95) 50%,
      rgba(17, 24, 39, 0.95) 100%
    );
    border-bottom: 1px solid rgba(6, 182, 212, 0.3);
    box-shadow: 0 1px 20px rgba(6, 182, 212, 0.2);
  }

  .cyberpunk-title {
    text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
    letter-spacing: 2px;
    font-family: "Courier New", monospace;
  }

  .cyberpunk-close-btn {
    box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
  }

  .cyberpunk-close-btn:hover {
    box-shadow: 0 0 25px rgba(6, 182, 212, 0.5);
  }

  .cyberpunk-glow {
    box-shadow: inset 0 0 20px rgba(6, 182, 212, 0.3);
  }

  @keyframes pulse-glow {
    0% {
      box-shadow:
        0 0 50px rgba(6, 182, 212, 0.3),
        inset 0 0 50px rgba(6, 182, 212, 0.05),
        0 0 100px rgba(147, 51, 234, 0.2);
    }
    100% {
      box-shadow:
        0 0 70px rgba(6, 182, 212, 0.4),
        inset 0 0 70px rgba(6, 182, 212, 0.08),
        0 0 120px rgba(147, 51, 234, 0.3);
    }
  }

  /* Flowbite TabItem Override Styles */
  :global(.cyberpunk-tab-content) {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
  }

  :global([role="tablist"]) {
    background: linear-gradient(
      135deg,
      rgba(17, 24, 39, 0.8) 0%,
      rgba(31, 41, 55, 0.8) 100%
    ) !important;
    border: 1px solid rgba(6, 182, 212, 0.3) !important;
    border-radius: 12px !important;
    padding: 4px !important;
    margin-bottom: 0 !important;
  }

  :global([role="tab"]) {
    background: transparent !important;
    border: 1px solid rgba(6, 182, 212, 0.2) !important;
    border-radius: 8px !important;
    color: rgba(6, 182, 212, 0.7) !important;
    font-weight: bold !important;
    font-family: "Courier New", monospace !important;
    letter-spacing: 1px !important;
    text-transform: uppercase !important;
    transition: all 0.3s ease !important;
    margin: 2px !important;
    padding: 8px 16px !important;
    cursor: pointer !important;
  }

  :global([role="tab"]:hover) {
    background: rgba(6, 182, 212, 0.1) !important;
    border-color: rgba(6, 182, 212, 0.5) !important;
    color: rgba(6, 182, 212, 1) !important;
    box-shadow: 0 0 15px rgba(6, 182, 212, 0.3) !important;
    transform: translateY(-1px) !important;
  }

  :global([role="tab"][aria-selected="true"]) {
    background: linear-gradient(
      135deg,
      rgba(6, 182, 212, 0.2) 0%,
      rgba(147, 51, 234, 0.2) 100%
    ) !important;
    border-color: rgba(6, 182, 212, 0.8) !important;
    color: rgba(6, 182, 212, 1) !important;
    box-shadow:
      0 0 20px rgba(6, 182, 212, 0.4),
      inset 0 0 20px rgba(6, 182, 212, 0.1) !important;
    text-shadow: 0 0 10px rgba(6, 182, 212, 0.5) !important;
  }

  :global([role="tabpanel"]) {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
</style>
