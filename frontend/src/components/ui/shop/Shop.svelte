<script lang="ts">
  import { onMount } from "svelte";
  import {
    Crown,
    Clock,
    DollarSign,
    ShoppingBag,
    Star,
    Zap,
    Wallet,
    X,
    Shield,
    Gift,
    Trophy,
    Users,
  } from "lucide-svelte";

  import { useVip, formatDate, isExpired } from "../../../hooks/useVip";

  import { useWallet } from "../../../hooks/useWallet";

  import { showShop } from "#stores/shopStore";

  const { vipStore, loadVipData, buyMembership } = useVip();

  const { isConnected, connect } = useWallet();


  console.log("vipStore:", $vipStore);
  // console.log("vipStore:", loadVipData);
  // console.log("vipStore:", vipStore);


  // Modal state
  let showDetails = false;

  // Reactive statements
  $: vipData = $vipStore;
  $: isVip = vipData.isVip;
  $: price = vipData.price;
  $: expiry = vipData.expiry;
  $: loading = vipData.loading;
  $: error = vipData.error;

  // Computed values
  $: expired = isExpired(expiry);
  $: expiryDate = expiry > 0 ? formatDate(expiry) : "";
  $: needsRenewal = isVip && expired;
  $: isActive = isVip && !expired;

  // Load VIP data when component mounts or wallet connects
  onMount(() => {
    if ($isConnected) {
      loadVipData();
    }
  });

  // Auto-refresh data when wallet connects
  $: if ($isConnected) {
    loadVipData();
  }

  async function handlePurchase() {
    if (!$isConnected) {
      await connect();
      return;
    }

    await buyMembership();
  }

  function openDetails() {
    showDetails = true;
  }

  function closeDetails() {
    showDetails = false;
  }
</script>

{#if $showShop}
  <div
    class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <!-- Close Button -->
    <button
      class="absolute top-4 right-4 text-cyan-400 hover:text-cyan-300 transition-colors z-50 p-2 rounded-full bg-black/50 border border-cyan-500/30 hover:border-cyan-400 drop-shadow-lg"
      on:click={() => ($showShop = false)}
    >
      <X class="h-6 w-6" />
    </button>

    <div class="max-w-6xl mx-auto space-y-8">
      <!-- Header -->
      <div class="text-center py-12">
        <div class="flex items-center justify-center gap-3 mb-6">
          <ShoppingBag class="h-10 w-10 text-cyan-400 cyberpunk-glow" />
          <h1
            class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 cyberpunk-title"
          >
            PREMIUM STORE
          </h1>
        </div>
        <p class="text-cyan-100/70 text-xl max-w-2xl mx-auto font-mono">
          Discover our exclusive products and join the premium community
        </p>
      </div>

      {#if !$isConnected}
        <!-- Connect Wallet Section -->
        <div class="flex justify-center">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg border p-8 text-center max-w-md"
          >
            <Wallet class="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 class="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
            <p class="text-muted-foreground mb-6">
              To purchase a VIP membership, you need to connect your MetaMask
              wallet
            </p>
            <button
              class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
              on:click={connect}
            >
              Connect MetaMask
            </button>
          </div>
        </div>
      {:else if loading}
        <!-- Loading Section -->
        <div class="flex justify-center">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg border p-8 text-center"
          >
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
            ></div>
            <p class="text-muted-foreground text-white">
              Loading membership information...
            </p>
          </div>
        </div>
      {:else if error}
        <!-- Error Section -->
        <div class="flex justify-center">
          <div
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center max-w-md"
          >
            <div class="text-red-600 text-4xl mb-4">❌</div>
            <h3
              class="text-xl font-semibold text-red-800 dark:text-red-200 mb-2"
            >
              Error
            </h3>
            <p class="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <button
              class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              on:click={loadVipData}
            >
              Retry
            </button>
          </div>
        </div>
      {:else}
        <!-- Products Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- VIP Membership Product -->
          <div
            class="relative overflow-hidden border-2 border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:scale-105 bg-black/80 backdrop-blur-lg shadow-cyan-500/30 shadow-lg hover:shadow-cyan-400/50 rounded-lg"
          >
            <!-- Status Badge -->
            <div class="absolute top-4 right-4">
              {#if isActive}
                <span
                  class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium drop-shadow-lg"
                >
                  Active
                </span>
              {:else if needsRenewal}
                <span
                  class="bg-gradient-to-r from-orange-600 to-red-600 text-white px-2 py-1 rounded-full text-xs font-medium drop-shadow-lg"
                >
                  Expired
                </span>
              {:else}
                <span
                  class="bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium drop-shadow-lg"
                >
                  Popular
                </span>
              {/if}
            </div>

            <div class="p-6 pb-4">
              <div class="flex items-center gap-3 mb-2">
                <Crown class="h-8 w-8 text-cyan-400 drop-shadow-lg" />
                <h3
                  class="text-2xl font-semibold text-cyan-400 font-mono tracking-wider drop-shadow-lg"
                >
                  VIP MEMBERSHIP
                </h3>
              </div>
              <p class="text-cyan-100/70 text-base mb-4 font-mono">
                Exclusive access to premium features and special benefits
              </p>
            </div>

            <div class="px-6 pb-6 space-y-4">
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-cyan-400 drop-shadow-lg"
                  >{price}</span
                >
                <span class="text-cyan-100/70 font-mono">Sei</span>
                <span class="text-sm text-cyan-100/70 font-mono">/ 30 días</span
                >
              </div>

              {#if isActive}
                <div
                  class="bg-green-900/30 border border-green-400/50 rounded-lg p-3 shadow-green-400/30 shadow-lg"
                >
                  <div class="flex items-center gap-2 text-green-400">
                    <Crown class="h-4 w-4 drop-shadow-lg" />
                    <span class="text-sm font-medium font-mono"
                      >Active until {expiryDate}</span
                    >
                  </div>
                </div>
              {:else}
                <div class="space-y-3">
                  <div class="flex items-center gap-2">
                    <Star class="h-4 w-4 text-yellow-400 drop-shadow-lg" />
                    <span class="text-sm text-cyan-100/80 font-mono"
                      >Access to exclusive content</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <Zap class="h-4 w-4 text-blue-400 drop-shadow-lg" />
                    <span class="text-sm text-cyan-100/80 font-mono"
                      >Premium features unlocked</span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <Crown class="h-4 w-4 text-purple-400 drop-shadow-lg" />
                    <span class="text-sm text-cyan-100/80 font-mono"
                      >VIP status for 30 days</span
                    >
                  </div>
                </div>
              {/if}

              <button
                class="w-full bg-black/50 hover:bg-cyan-500/20 border-2 border-cyan-500/50 hover:border-cyan-400 text-cyan-400 uppercase tracking-wide font-medium py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer font-mono hover:shadow-cyan-400/50 hover:shadow-lg"
                on:click={openDetails}
              >
                VIEW DETAILS
              </button>

              {#if !isActive}
                <button
                  class="w-full cursor-pointer bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold uppercase tracking-wide py-3 px-4 rounded-lg transition-all duration-200 font-mono relative overflow-hidden"
                  on:click={handlePurchase}
                  disabled={loading}
                >
                  {#if loading}
                    <div class="flex items-center justify-center gap-2">
                      <div
                        class="animate-spin rounded-full h-4 w-4 border-b-2 border-black"
                      ></div>
                      PROCESSING...
                    </div>
                  {:else}
                    {needsRenewal ? "RENEW NOW" : "BUY NOW"}
                  {/if}
                </button>
              {/if}
            </div>
          </div>

          <!-- Placeholder Products -->
          <div
            class="relative overflow-hidden border-2 border-gray-500/30 bg-black/60 backdrop-blur-lg rounded-lg opacity-75"
          >
            <div class="absolute top-4 right-4">
              <span
                class="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-2 py-1 rounded-full text-xs font-medium font-mono"
              >
                COMING SOON
              </span>
            </div>

            <div class="p-6 pb-4">
              <div class="flex items-center gap-3 mb-2">
                <Zap class="h-8 w-8 text-gray-400" />
                <h3 class="text-2xl font-semibold text-gray-400 font-mono">
                  PREMIUM TOOLS
                </h3>
              </div>
              <p class="text-gray-500 text-base mb-4 font-mono">
                Advanced tools for professional users
              </p>

              <div class="flex items-baseline gap-2 mb-4">
                <span class="text-3xl font-bold text-gray-400">0.05</span>
                <span class="text-gray-500 font-mono">Sei</span>
              </div>
            </div>

            <div class="px-6 pb-6">
              <button
                disabled
                class="w-full bg-gray-700/50 text-gray-400 font-medium py-3 px-4 rounded-lg cursor-not-allowed font-mono"
              >
                COMING SOON
              </button>
            </div>
          </div>

          <div
            class="relative overflow-hidden border-2 border-gray-500/30 bg-black/60 backdrop-blur-lg rounded-lg opacity-75"
          >
            <div class="absolute top-4 right-4">
              <span
                class="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-2 py-1 rounded-full text-xs font-medium font-mono"
              >
                PRÓXIMAMENTE
              </span>
            </div>

            <div class="p-6 pb-4">
              <div class="flex items-center gap-3 mb-2">
                <Star class="h-8 w-8 text-gray-400" />
                <h3 class="text-2xl font-semibold text-gray-400 font-mono">
                  ELITE ACCESS
                </h3>
              </div>
              <p class="text-gray-500 text-base mb-4 font-mono">
                Lifetime access to all premium features
              </p>

              <div class="flex items-baseline gap-2 mb-4">
                <span class="text-3xl font-bold text-gray-400">1.0</span>
                <span class="text-gray-500 font-mono">Sei</span>
              </div>
            </div>

            <div class="px-6 pb-6">
              <button
                disabled
                class="w-full bg-gray-700/50 text-gray-400 font-medium py-3 px-4 rounded-lg cursor-not-allowed font-mono"
              >
                PRÓXIMAMENTE
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Details Modal -->
  {#if showDetails}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      on:click={closeDetails}
    >
      <div
        class="bg-black/90 backdrop-blur-lg border-2 border-cyan-500/50 rounded-lg max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-cyan-500/30 shadow-lg flex flex-col"
        on:click|stopPropagation
      >
        <!-- Modal Header -->
        <div
          class="flex items-center justify-between p-6 border-b border-cyan-500/30"
        >
          <div class="flex items-center gap-3">
            <Crown class="h-8 w-8 text-cyan-400 drop-shadow-lg" />
            <h2
              class="text-2xl font-bold text-cyan-400 font-mono tracking-wider drop-shadow-lg"
            >
              VIP MEMBERSHIP DETAILS
            </h2>
          </div>
          <button
            class="text-cyan-400 hover:text-cyan-300 transition-colors drop-shadow-lg cursor-pointer"
            on:click={closeDetails}
          >
            <X class="h-6 w-6" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 space-y-6 overflow-y-auto flex-1">
          <!-- Current Status -->
          <div
            class="bg-black/50 border border-cyan-500/30 rounded-lg p-6 shadow-cyan-500/30 shadow-lg"
          >
            <h3
              class="text-xl font-semibold mb-4 flex items-center gap-2 text-cyan-400 font-mono tracking-wider drop-shadow-lg"
            >
              <Shield class="h-5 w-5 drop-shadow-lg" />
              CURRENT STATUS
            </h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <p class="text-sm text-cyan-100/70 font-mono">
                  Membership Status
                </p>
                <p class="font-semibold text-lg">
                  {#if isActive}
                    <span class="text-green-400 cyberpunk-glow">✅ ACTIVE</span>
                  {:else if needsRenewal}
                    <span class="text-orange-400 cyberpunk-glow"
                      >⏰ EXPIRED</span
                    >
                  {:else}
                    <span class="text-gray-400">❌ NOT ACTIVE</span>
                  {/if}
                </p>
              </div>
              <div class="space-y-2">
                <p class="text-sm text-cyan-100/70 font-mono">
                  Expiration Date
                </p>
                <p class="font-semibold text-lg text-cyan-400">
                  {expiryDate || "Not available"}
                </p>
              </div>
            </div>
          </div>

          <!-- Pricing Information -->
          <div
            class="bg-black/50 border border-cyan-500/30 rounded-lg p-6 shadow-cyan-500/30 shadow-lg"
          >
            <h3
              class="text-xl font-semibold mb-4 flex items-center gap-2 text-cyan-400 font-mono tracking-wider drop-shadow-lg"
            >
              <DollarSign class="h-5 w-5 drop-shadow-lg" />
              PRICING INFORMATION
            </h3>
            <div class="grid md:grid-cols-3 gap-4">
              <div class="text-center">
                <p class="text-3xl font-bold text-cyan-400 drop-shadow-lg">
                  {price}
                </p>
                <p class="text-sm text-cyan-100/70 font-mono">Sei</p>
              </div>
              <div class="text-center">
                <p class="text-3xl font-bold text-purple-400 drop-shadow-lg">
                  30
                </p>
                <p class="text-sm text-cyan-100/70 font-mono">Days</p>
              </div>
              <div class="text-center">
                <p class="text-3xl font-bold text-green-400 drop-shadow-lg">
                  ∞
                </p>
                <p class="text-sm text-cyan-100/70 font-mono">Benefits</p>
              </div>
            </div>
          </div>

          <!-- Benefits Details -->
          <div
            class="bg-black/50 border border-cyan-500/30 rounded-lg p-6 shadow-cyan-500/30 shadow-lg"
          >
            <h3
              class="text-xl font-semibold mb-4 flex items-center gap-2 text-cyan-400 font-mono tracking-wider drop-shadow-lg"
            >
              <Gift class="h-5 w-5 drop-shadow-lg" />
              INCLUDED BENEFITS
            </h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div
                class="border border-cyan-500/30 rounded-lg p-4 shadow-cyan-500/30 shadow-lg"
              >
                <div class="flex items-center gap-3 mb-2">
                  <Star class="h-5 w-5 text-yellow-400 drop-shadow-lg" />
                  <h4 class="font-semibold text-cyan-400 font-mono">
                    Priority Access
                  </h4>
                </div>
                <p class="text-sm text-cyan-100/70 font-mono">
                  Get first access to new features, special events and exclusive
                  content before other users.
                </p>
              </div>
              <div
                class="border border-cyan-500/30 rounded-lg p-4 shadow-cyan-500/30 shadow-lg"
              >
                <div class="flex items-center gap-3 mb-2">
                  <Zap class="h-5 w-5 text-blue-400 drop-shadow-lg" />
                  <h4 class="font-semibold text-cyan-400 font-mono">
                    Premium Features
                  </h4>
                </div>
                <p class="text-sm text-cyan-100/70 font-mono">
                  Unlock advanced tools, special configurations and exclusive
                  options for VIP members.
                </p>
              </div>
              <div
                class="border border-cyan-500/30 rounded-lg p-4 shadow-cyan-500/30 shadow-lg"
              >
                <div class="flex items-center gap-3 mb-2">
                  <Trophy class="h-5 w-5 text-purple-400 drop-shadow-lg" />
                  <h4 class="font-semibold text-cyan-400 font-mono">
                    VIP Badge
                  </h4>
                </div>
                <p class="text-sm text-cyan-100/70 font-mono">
                  Show your premium status with a special badge visible to all
                  users.
                </p>
              </div>
              <div
                class="border border-cyan-500/30 rounded-lg p-4 shadow-cyan-500/30 shadow-lg"
              >
                <div class="flex items-center gap-3 mb-2">
                  <Users class="h-5 w-5 text-green-400 drop-shadow-lg" />
                  <h4 class="font-semibold text-cyan-400 font-mono">
                    Exclusive Community
                  </h4>
                </div>
                <p class="text-sm text-cyan-100/70 font-mono">
                  Access to private channels, special events and networking with
                  other VIP members.
                </p>
              </div>
            </div>
          </div>

          <!-- Contract MSeiods -->

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-4 border-t border-cyan-500/30">
            {#if !isActive}
              <button
                class="flex-1 cursor-pointer bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-medium py-3 px-6 rounded-lg transition-all duration-200 font-mono drop-shadow-lg"
                on:click={() => {
                  closeDetails();
                  handlePurchase();
                }}
                disabled={loading}
              >
                {#if loading}
                  <div class="flex items-center justify-center gap-2">
                    <div
                      class="animate-spin rounded-full h-4 w-4 border-b-2 border-black"
                    ></div>
                    PROCESSING...
                  </div>
                {:else}
                  {needsRenewal ? "RENEW MEMBERSHIP" : "BUY MEMBERSHIP"}
                {/if}
              </button>
            {/if}
            <button
              class="px-6 py-3 cursor-pointer border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-colors font-mono drop-shadow-lg"
              on:click={closeDetails}
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
{/if}

<style>
  /* Custom Scrollbar for Modal Content */
  .overflow-y-auto::-webkit-scrollbar {
    width: 8px;
  }

  .overflow-y-auto::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #00ffff, #8000ff);
    border-radius: 4px;
    box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  }

  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, #00cccc, #6600cc);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
  }

  /* Firefox scrollbar */
  .overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: #00ffff rgba(0, 0, 0, 0.3);
  }
</style>
