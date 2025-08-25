<script lang="ts">
  import { useWallet } from "#hooks/useWallet";

  const { connect, isConnecting, error } = useWallet();

  const handleConnect = async () => {
    await connect();
  };
</script>

<div class="flex flex-col items-center justify-center h-full p-8">
  <div class="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-cyan-500/30 max-w-md w-full cyberpunk-auth-container">
    <div class="text-center mb-6">
      <div class="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
        <svg class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">CONNECT WALLET</h3>
      <p class="text-cyan-200/80 text-sm">Connect your wallet to access the game dashboard</p>
    </div>

    {#if $error}
      <div class="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-4 backdrop-blur-sm">
        <p class="text-red-300 text-sm">{$error}</p>
      </div>
    {/if}

    <button
      class="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-cyan-500/30 hover:border-cyan-400/50 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30"
      onclick={handleConnect}
      disabled={$isConnecting}
    >
      {#if $isConnecting}
        <div class="flex items-center justify-center gap-2">
          <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Connecting...
        </div>
      {:else}
        Connect Wallet
      {/if}
    </button>

    <div class="mt-4 text-center">
      <p class="text-xs text-cyan-300/60">
        Make sure you have MetaMask or another compatible wallet installed
      </p>
    </div>
  </div>
</div>

<style>
  .cyberpunk-auth-container {
    box-shadow: 
      0 0 30px rgba(6, 182, 212, 0.2),
      inset 0 0 30px rgba(6, 182, 212, 0.05),
      0 0 60px rgba(147, 51, 234, 0.15);
    animation: pulse-glow 4s ease-in-out infinite alternate;
  }

  @keyframes pulse-glow {
    0% {
      box-shadow: 
        0 0 30px rgba(6, 182, 212, 0.2),
        inset 0 0 30px rgba(6, 182, 212, 0.05),
        0 0 60px rgba(147, 51, 234, 0.15);
    }
    100% {
      box-shadow: 
        0 0 40px rgba(6, 182, 212, 0.3),
        inset 0 0 40px rgba(6, 182, 212, 0.08),
        0 0 80px rgba(147, 51, 234, 0.25);
    }
  }
</style>