<script lang="ts">
  import { useWallet } from "#hooks/useWallet";
  import { copyAddress, formatAddress, getNetworkName } from "#lib/utils/utils.ts";
  import { dashboardService, dashboardStore } from "#stores/dashBoradStore";

  const { isConnected, address, chainId, disconnect, switchToSeiTestnet } = useWallet();

  let isAddingNetwork = false;

  const handleDisconnect = async () => {
    await disconnect();
    dashboardService.close();
  };

  const handleSwitchToSeiTestnet = async () => {
    if (isAddingNetwork) return;
    
    isAddingNetwork = true;
    try {
      await switchToSeiTestnet();
    } catch (error) {
      console.error('Error al cambiar de red:', error);
    } finally {
      isAddingNetwork = false;
    }
  };
</script>

<div class="flex flex-col gap-6">
  <div class="bg-gray-900/90 border border-cyan-500/30 rounded-xl p-6 cyberpunk-wallet-container backdrop-blur-sm">
    <div class="flex justify-between items-center mb-4">
      <h4 class="text-cyan-100 font-bold text-lg cyberpunk-section-title">WALLET INFORMATION</h4>
      <div
        class="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/60 cyberpunk-status-indicator"
      ></div>
    </div>

    <div class="flex justify-between items-center mb-3 cyberpunk-info-row">
      <span class="font-medium text-cyan-300 cyberpunk-label">ADDRESS:</span>
      <div class="flex items-center gap-2">
        <span class="font-mono font-bold text-cyan-400 cyberpunk-address"
          >{formatAddress($address)}</span
        >
        <button
          class="cursor-pointer p-2 rounded-lg hover:bg-cyan-500/20 transition-all duration-200 border border-cyan-500/30 hover:border-cyan-400/50 cyberpunk-copy-btn"
          onclick={() => {
            if ($address) copyAddress($address);
          }}
          title="Copy address"
        >
          <span class="text-cyan-400">📋</span>
        </button>
      </div>
    </div>

    <div class="flex justify-between items-center mb-3 cyberpunk-info-row">
      <span class="font-medium text-cyan-300 cyberpunk-label">NETWORK:</span>
      <div class="flex items-center gap-2">
        <span class="font-medium text-cyan-100">{getNetworkName($chainId)}</span>
        {#if $chainId !== 1328}
          <span class="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30 cyberpunk-warning">⚠️ WRONG NETWORK</span>
        {/if}
      </div>
    </div>

    <div class="flex justify-between items-center mb-4 cyberpunk-info-row">
      <span class="font-medium text-cyan-300 cyberpunk-label">CHAIN ID:</span>
      <span class="font-medium text-cyan-100 font-mono">{$chainId}</span>
    </div>

    {#if $chainId !== 1328}
      <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4 cyberpunk-warning-box backdrop-blur-sm">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-red-400 text-lg">⚠️</span>
          <span class="text-sm font-bold text-red-400 cyberpunk-warning-title">NETWORK ERROR DETECTED</span>
        </div>
        <p class="text-sm text-red-300 mb-3 cyberpunk-warning-text">
          CLANS REQUIRE SEI TESTNET CONNECTION.
        </p>
        <button
          class="bg-red-500/20 hover:bg-red-500/30 disabled:bg-red-500/10 disabled:cursor-not-allowed text-red-400 hover:text-red-300 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 w-full border border-red-500/30 hover:border-red-400/50 cyberpunk-switch-btn"
          onclick={handleSwitchToSeiTestnet}
          disabled={isAddingNetwork}
        >
          {#if isAddingNetwork}
            🔄 CONNECTING...
          {:else}
            &gt;&gt; SWITCH TO SEI TESTNET &lt;&lt;
          {/if}
        </button>
      </div>
    {/if}
  </div>

  <div class="flex justify-center">
    <button
      class="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-6 py-3 rounded-lg font-bold transition-all duration-200 border border-red-500/30 hover:border-red-400/50 cyberpunk-disconnect-btn"
      onclick={() => handleDisconnect()}
    >
      🔌 DISCONNECT WALLET
    </button>
  </div>
</div>

<style>
  .cyberpunk-wallet-container {
    box-shadow: 
      0 0 30px rgba(6, 182, 212, 0.2),
      inset 0 0 30px rgba(6, 182, 212, 0.05);
    background: linear-gradient(135deg, 
      rgba(17, 24, 39, 0.9) 0%, 
      rgba(31, 41, 55, 0.9) 50%, 
      rgba(17, 24, 39, 0.9) 100%);
  }

  .cyberpunk-section-title {
    text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
    letter-spacing: 1px;
    font-family: 'Courier New', monospace;
  }

  .cyberpunk-status-indicator {
    animation: pulse-green 2s ease-in-out infinite;
    box-shadow: 0 0 15px rgba(34, 197, 94, 0.6);
  }

  .cyberpunk-info-row {
    padding: 8px 0;
    border-bottom: 1px solid rgba(6, 182, 212, 0.1);
  }

  .cyberpunk-label {
    font-family: 'Courier New', monospace;
    letter-spacing: 1px;
    text-shadow: 0 0 5px rgba(6, 182, 212, 0.3);
  }

  .cyberpunk-address {
    text-shadow: 0 0 8px rgba(6, 182, 212, 0.4);
    background: linear-gradient(90deg, rgba(6, 182, 212, 0.1) 0%, transparent 100%);
    padding: 4px 8px;
    border-radius: 4px;
  }

  .cyberpunk-copy-btn {
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.2);
  }

  .cyberpunk-copy-btn:hover {
    box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
    transform: scale(1.05);
  }

  .cyberpunk-warning {
    animation: pulse-red 1.5s ease-in-out infinite;
    text-shadow: 0 0 5px rgba(239, 68, 68, 0.5);
  }

  .cyberpunk-warning-box {
    box-shadow: 
      0 0 20px rgba(239, 68, 68, 0.3),
      inset 0 0 20px rgba(239, 68, 68, 0.05);
  }

  .cyberpunk-warning-title {
    text-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
    letter-spacing: 1px;
    font-family: 'Courier New', monospace;
  }

  .cyberpunk-warning-text {
    font-family: 'Courier New', monospace;
    letter-spacing: 0.5px;
  }

  .cyberpunk-switch-btn {
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
    font-family: 'Courier New', monospace;
    letter-spacing: 1px;
  }

  .cyberpunk-switch-btn:hover {
    box-shadow: 0 0 25px rgba(239, 68, 68, 0.5);
    transform: translateY(-2px);
  }

  .cyberpunk-disconnect-btn {
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
    font-family: 'Courier New', monospace;
    letter-spacing: 1px;
  }

  .cyberpunk-disconnect-btn:hover {
    box-shadow: 0 0 25px rgba(239, 68, 68, 0.5);
    transform: translateY(-2px);
  }

  @keyframes pulse-green {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
  }

  @keyframes pulse-red {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
</style>
