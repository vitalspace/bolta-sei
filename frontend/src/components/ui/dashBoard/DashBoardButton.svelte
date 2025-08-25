<script>
  import { dashboardStore } from "#stores/dashBoradStore";
  import DashBoard from "./DashBoard.svelte";
  import { useWallet } from "#hooks/useWallet";
  import { formatAddress } from "#lib/utils/utils";

  const { isConnected, address } = useWallet();

  function openDashboard() {
    $dashboardStore.isOpen = true;
  }
</script>

<div class="fixed top-4 right-4 z-40 flex flex-col items-end gap-2">
  <!-- Wallet Address Display -->
  {#if $isConnected && $address}
    <div class="bg-gray-900/90 backdrop-blur-xl border border-cyan-500/20 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span class="tracking-wider">{formatAddress($address)}</span>
      </div>
    </div>
  {/if}
  
  <!-- Dashboard Button -->
  <button
    onclick={openDashboard}
    class="group relative px-6 py-3 bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl text-cyan-100 font-bold text-sm font-mono tracking-[2px] transition-all duration-300 transform hover:scale-105 active:scale-95 hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2),inset_0_0_20px_rgba(6,182,212,0.05)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4),0_0_60px_rgba(147,51,234,0.2),inset_0_0_30px_rgba(6,182,212,0.1)] animate-pulse"
    title="Open Game Dashboard"
    style="text-shadow: 0 0 10px rgba(6, 182, 212, 0.3); animation: pulse-dashboard 3s ease-in-out infinite;"
  >
    <span class="relative z-10">DASHBOARD</span>
    
    <!-- Glow effect -->
    <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_30px_rgba(6,182,212,0.2)]"></div>
    
    <!-- Border glow -->
    <div class="absolute inset-0 rounded-xl border border-cyan-400/0 group-hover:border-cyan-400/30 transition-all duration-300"></div>
  </button>
</div>

<style>
  @keyframes pulse-dashboard {
    0%, 100% {
      box-shadow: 
        0 0 20px rgba(6, 182, 212, 0.2),
        inset 0 0 20px rgba(6, 182, 212, 0.05);
    }
    50% {
      box-shadow: 
        0 0 25px rgba(6, 182, 212, 0.3),
        inset 0 0 25px rgba(6, 182, 212, 0.08);
    }
  }
</style>

<DashBoard />
