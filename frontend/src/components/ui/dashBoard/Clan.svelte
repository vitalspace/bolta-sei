<script lang="ts">
  import { useAI } from "#hooks/useAI";
  import { useClan } from "#hooks/useClan";
  import { useWallet } from "#hooks/useWallet";
  import { formatAddress } from "#lib/utils/utils.ts";
  import { toastStore } from "#stores/toastStore";
  import ConfirmDialog from "../ConfirmDialog.svelte";

  const { address, isConnected } = useWallet();
  const { generateClanSuggestions, isLoading: aiLoading } = useAI();

  let clanInfo = $state<undefined | any>(undefined);

  // Obtener información del clan del usuario
  const getUserClanInfo = async () => {
    if (!$address || !$isConnected) {
      clanInfo = null;
      return;
    }

    try {
      const userClanName = await useClan.getPlayerClan($address);
      if (userClanName && userClanName !== "") {
        const clanData = await useClan.getClan(userClanName);
        clanInfo = {
          name: clanData[0],
          acronym: clanData[1],
          leader: clanData[2],
          members: clanData[3],
          creationTime: Number(clanData[4]),
          joinPrice: Number(clanData[5]),
          logoUrl: clanData[6],
        };
      } else {
        clanInfo = null;
      }
    } catch (error: any) {
      // Si el error es por datos vacíos, significa que el usuario no pertenece a ningún clan
      //@ts-ignore
      if (
        error.message &&
        error.message.includes("could not decode result data")
      ) {
        clanInfo = null;
      } else {
        console.error("Error getting clan information:", error);
        clanInfo = null;
      }
    }
  };

  interface ClanData {
    name: string;
    acronym: string;
    leader: string;
    members: string[];
    creationTime: number;
    joinPrice: bigint;
    memberCount: number;
    logoUrl: string;
  }

  let newClanName = $state("");
  let newClanAcronym = $state("");
  let newClanLogo = $state("");
  let allClans = $state<ClanData[] | any>([]);

  let loading = $state(false);
  let joinClanName = $state("");

  // Variables para funciones de líder
  let newJoinPrice = $state("");
  let newMemberAddress = $state("");
  let selectedMemberToRemove = $state("");
  let newClanLogoUrl = $state("");

  // Dialog states
  let showDissolveClanDialog = $state(false);
  let showRemoveMemberDialog = $state(false);
  let memberToRemove = $state("");

  // AI Suggestions states
  let showAISuggestions = $state(false);
  let aiSuggestions = $state<any[]>([]);
  let aiPreferences = $state("");

  const getAllClans = async () => {
    // Evitar ejecuciones concurrentes
    if (loading) {
      return;
    }

    try {
      loading = true;

      if (!$isConnected) {
        loading = false;
        return;
      }

      // Pequeña espera para asegurar que el provider esté completamente inicializado
      await new Promise((resolve) => setTimeout(resolve, 100));

      let clanNames;
      try {
        clanNames = await useClan.getAllClans();
      } catch (getAllClansError) {
        // Handle the case when no clans exist (contract returns 0x)
        //@ts-ignore
        if (getAllClansError.message.includes("could not decode result data")) {
          allClans = [];
          return;
        }
        throw getAllClansError;
      }

      // Si no hay clanes, simplemente mostrar array vacío
      if (!clanNames || clanNames.length === 0) {
        allClans = [];
        return;
      }

      const clansData = [];

      for (const clanName of clanNames) {
        try {
          const clanData = await useClan.getClan(clanName);
          const memberCount = await useClan.getMemberCount(clanName);

          clansData.push({
            name: clanData[0],
            acronym: clanData[1],
            leader: clanData[2],
            members: clanData[3],
            creationTime: Number(clanData[4]),
            joinPrice: Number(clanData[5]),
            logoUrl: clanData[6],
            memberCount: Number(memberCount),
          });
        } catch (error) {
          console.error(`Error getting clan data ${clanName}:`, error);
        }
      }

      allClans = clansData;
    } catch (error) {
      console.error("Error getting clans:", error);
      //@ts-ignore
      toastStore.showToast("error", "Error loading clans: " + error.message);
      allClans = [];
    } finally {
      loading = false;
    }
  };

  const createClan = async () => {
    if (!newClanName || !newClanAcronym) {
      toastStore.showToast("warning", "Please complete all fields");
      return;
    }

    try {
      loading = true;
      const tx = await useClan.createClan(
        newClanName,
        newClanAcronym,
        newClanLogo || ""
      );
      await tx.wait();
      toastStore.showToast("success", "Clan created successfully!");
      newClanName = "";
      newClanAcronym = "";
      newClanLogo = "";
      await getAllClans();
      await getUserClanInfo();
    } catch (error) {
      console.error("Error creating clan:", error);
      toastStore.showToast("error", "Error creating clan");
    } finally {
      loading = false;
    }
  };

  const joinClan = async (clanName: string) => {
    try {
      loading = true;
      const joinPrice = await useClan.getClanJoinPrice(clanName);
      const priceInEth =
        joinPrice > 0 ? (Number(joinPrice) / 1e18).toString() : "0";

      const tx = await useClan.joinClan(
        clanName,
        priceInEth > "0" ? priceInEth : undefined
      );
      await tx.wait();
      toastStore.showToast("success", "You have successfully joined the clan!");
      await getAllClans();
    } catch (error) {
      console.error("Error joining clan:", error);
      toastStore.showToast("error", "Error joining clan");
    } finally {
      loading = false;
    }
  };

  const leaveClan = async () => {
    try {
      loading = true;
      const tx = await useClan.leaveClan();
      await tx.wait();
      toastStore.showToast("success", "You have left the clan");
      await getAllClans();
    } catch (error) {
      console.error("Error leaving clan:", error);
      toastStore.showToast("error", "Error leaving clan");
    } finally {
      loading = false;
    }
  };

  const initiateDissolveClan = () => {
    if (!clanInfo?.name) return;
    showDissolveClanDialog = true;
  };

  const confirmDissolveClan = async () => {
    if (!clanInfo?.name) return;

    try {
      loading = true;
      const tx = await useClan.dissolveClan(clanInfo.name);
      await tx.wait();
      toastStore.showToast("success", "Clan dissolved successfully");
      await getAllClans();
    } catch (error) {
      console.error("Error dissolving clan:", error);
      toastStore.showToast("error", "Error dissolving clan");
    } finally {
      loading = false;
    }
  };

  const setJoinPrice = async () => {
    if (!clanInfo?.name || !newJoinPrice) {
      toastStore.showToast("warning", "Please enter a valid price");
      return;
    }

    try {
      loading = true;
      const priceInWei = (parseFloat(newJoinPrice) * 1e18).toString();
      const tx = await useClan.setJoinPrice(clanInfo.name, newJoinPrice);
      await tx.wait();
      toastStore.showToast("success", "Join price updated successfully");
      newJoinPrice = "";
      await getAllClans();
    } catch (error) {
      console.error("Error setting join price:", error);
      toastStore.showToast("error", "Error setting join price");
    } finally {
      loading = false;
    }
  };

  const addMemberToClan = async () => {
    if (!clanInfo?.name || !newMemberAddress) {
      toastStore.showToast("warning", "Please enter a valid address");
      return;
    }

    try {
      loading = true;
      const tx = await useClan.addMember(clanInfo.name, newMemberAddress);
      await tx.wait();
      toastStore.showToast("success", "Member added successfully");
      newMemberAddress = "";
      await getUserClanInfo();
      await getAllClans();
    } catch (error) {
      console.error("Error adding member:", error);
      toastStore.showToast("error", "Error adding member");
    } finally {
      loading = false;
    }
  };

  const initiateRemoveMember = (memberAddress: string) => {
    if (!clanInfo?.name || !memberAddress) {
      toastStore.showToast("warning", "Please select a member");
      return;
    }
    memberToRemove = memberAddress;
    showRemoveMemberDialog = true;
  };

  const confirmRemoveMember = async () => {
    if (!clanInfo?.name || !memberToRemove) return;

    try {
      loading = true;
      const tx = await useClan.removeMember(clanInfo.name, memberToRemove);
      await tx.wait();
      toastStore.showToast("success", "Member removed successfully");
      memberToRemove = "";
      await getUserClanInfo();
      await getAllClans();
    } catch (error) {
      console.error("Error removing member:", error);
      toastStore.showToast("error", "Error removing member");
    } finally {
      loading = false;
    }
  };

  const updateClanLogo = async () => {
    if (!clanInfo?.name || !newClanLogoUrl) {
      toastStore.showToast("warning", "Please enter a valid logo URL");
      return;
    }

    try {
      loading = true;
      const tx = await useClan.updateClanLogo(clanInfo.name, newClanLogoUrl);
      await tx.wait();
      toastStore.showToast("success", "Clan logo updated successfully");
      newClanLogoUrl = "";
      await getUserClanInfo();
      await getAllClans();
    } catch (error) {
      console.error("Error updating clan logo:", error);
      toastStore.showToast("error", "Error updating clan logo");
    } finally {
      loading = false;
    }
  };

  // AI Functions
  const generateAISuggestions = async () => {
    try {
      const suggestions = await generateClanSuggestions(
        aiPreferences || undefined
      );
      aiSuggestions = suggestions;
      showAISuggestions = true;

      if (suggestions.length === 0) {
        toastStore.showToast(
          "warning",
          "No suggestions generated. Try different preferences."
        );
      } else {
        toastStore.showToast(
          "success",
          `Generated ${suggestions.length} clan suggestions!`
        );
      }
    } catch (error) {
      toastStore.showToast(
        "error",
        //@ts-ignore
        `Error: ${error.message || "Please check your API key configuration."}`
      );
    }
  };

  const selectAISuggestion = (suggestion: any) => {
    newClanName = suggestion.name;
    newClanAcronym = suggestion.acronym;
    showAISuggestions = false;
    toastStore.showToast(
      "success",
      `Selected: ${suggestion.name} [${suggestion.acronym}]`
    );
  };

  // Cargar clanes y información del usuario cuando el wallet esté conectado
  $effect(() => {
    if ($isConnected && $address) {
      // Esperar un poco para asegurar que todo esté inicializado
      setTimeout(async () => {
        await getUserClanInfo();
        await getAllClans();
      }, 500);
    }
  });
</script>

<div class="flex flex-col gap-6 p-4 h-full overflow-y-auto cyberpunk-scrollbar">
  <div class="p-6 cyberpunk-main-container rounded-xl">
    <div class="mb-4">
      <h4 class="text-cyan-500 font-bold mb-2 text-xl cyberpunk-main-title">
        CLAN MANAGEMENT
      </h4>
      <p class="text-cyan-300 text-sm cyberpunk-subtitle">
        &gt;&gt; JOIN OR CREATE YOUR CLAN TO DOMINATE &lt;&lt;
      </p>

      <button
        onclick={getAllClans}
        disabled={loading}
        class="cursor-pointer bg-cyan-500/20 hover:bg-cyan-500/30 disabled:bg-gray-500/20 text-cyan-400 hover:text-cyan-300 px-4 py-2 rounded-lg font-bold transition-all duration-200 border border-cyan-500/30 hover:border-cyan-400/50 cyberpunk-refresh-btn"
      >
        {loading ? "⏳ LOADING..." : "🔄 REFRESH CLANS"}
      </button>
    </div>

    {#if clanInfo}
      <!-- Player is in a clan -->
      <div
        class="bg-gray-900/90 border border-purple-500/30 rounded-xl p-6 cyberpunk-clan-container backdrop-blur-sm"
      >
        <div
          class="flex justify-between items-center mb-4 pb-3 border-b border-purple-500/30 cyberpunk-clan-header"
        >
          <h5 class="text-purple-400 font-bold text-lg cyberpunk-clan-name">
            [{clanInfo.acronym}] {clanInfo.name}
          </h5>
          <span
            class="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/30 cyberpunk-member-count"
          >
            {clanInfo.members.length} MEMBERS
          </span>
        </div>

        <div class="space-y-3 mb-4">
          <div class="flex justify-between items-center cyberpunk-info-row">
            <span class="font-medium text-cyan-300 cyberpunk-label"
              >LEADER:</span
            >
            <span class="font-medium text-cyan-100 font-mono cyberpunk-address"
              >{formatAddress(clanInfo.leader)}</span
            >
          </div>
          <div class="flex justify-between items-center cyberpunk-info-row">
            <span class="font-medium text-cyan-300 cyberpunk-label"
              >MEMBERS:</span
            >
            <span class="font-medium text-cyan-100 font-mono">
              {clanInfo.members.length}
            </span>
          </div>
          <div class="flex justify-between items-center cyberpunk-info-row">
            <span class="font-medium text-cyan-300 cyberpunk-label"
              >JOIN PRICE:</span
            >
            <span class="font-medium text-cyan-100 font-mono">
              {clanInfo.joinPrice > 0
                ? (Number(clanInfo.joinPrice) / 1e18).toFixed(4) + " ETH"
                : "FREE"}
            </span>
          </div>
          <div class="flex justify-between items-center cyberpunk-info-row">
            <span class="font-medium text-cyan-300 cyberpunk-label"
              >CREATED:</span
            >
            <span class="font-medium text-cyan-100 font-mono">
              {new Date(
                Number(clanInfo.creationTime) * 1000
              ).toLocaleDateString()}
            </span>
          </div>
          <div class="flex justify-between items-center cyberpunk-info-row">
            <span class="font-medium text-cyan-300 cyberpunk-label">LOGO:</span>
            <span class="font-medium text-cyan-100 font-mono">
              {#if clanInfo.logoUrl && clanInfo.logoUrl !== ""}
                <a
                  href={clanInfo.logoUrl}
                  target="_blank"
                  class="text-cyan-400 hover:text-cyan-300 underline"
                >
                  VIEW LOGO
                </a>
              {:else}
                NO LOGO
              {/if}
            </span>
          </div>
        </div>

        <div class="mt-4">
          <h6
            class="text-cyan-100 font-bold text-sm mb-2 cyberpunk-section-title"
          >
            MEMBERS:
          </h6>
          <div
            class="space-y-2 max-h-48 overflow-y-auto pr-2 cyberpunk-scrollbar"
          >
            {#each clanInfo.members as member}
              <div
                class="flex justify-between items-center p-3 bg-gray-800/50 border border-cyan-500/20 rounded-lg cyberpunk-member-item backdrop-blur-sm"
              >
                <span
                  class="font-mono text-sm text-cyan-100 cyberpunk-member-address"
                  >{formatAddress(member)}</span
                >
                {#if member === clanInfo.leader}
                  <span class="text-lg cyberpunk-crown">👑</span>
                {/if}
              </div>
            {/each}
          </div>
        </div>

        {#if clanInfo.leader === $address}
          <!-- Funciones de Líder -->
          <div class="mt-6 space-y-4">
            <h6
              class="text-purple-300 font-bold text-sm mb-3 cyberpunk-leader-title"
            >
              🔧 CLAN MANAGEMENT (LEADER)
            </h6>

            <!-- Establecer Precio de Unión -->
            <div
              class="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm"
            >
              <h7
                class="text-cyan-300 font-bold text-sm mb-2 block font-mono tracking-wider"
                >💰 SET JOIN PRICE</h7
              >
              <div class="mb-2 text-xs text-cyan-400/80 font-mono">
                Current price: {clanInfo.joinPrice > 0
                  ? (Number(clanInfo.joinPrice) / 1e18).toFixed(4) + " ETH"
                  : "Free"}
              </div>
              <div class="flex gap-2">
                <input
                  type="number"
                  bind:value={newJoinPrice}
                  placeholder="0.001"
                  step="0.001"
                  min="0"
                  class="flex-1 px-3 py-2 bg-gray-800/50 border border-cyan-500/30 rounded-md text-sm text-cyan-100 placeholder-cyan-500/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 backdrop-blur-sm font-mono"
                />
                <span
                  class="flex items-center text-sm text-cyan-400 font-bold font-mono"
                  >ETH</span
                >
                <button
                  onclick={setJoinPrice}
                  disabled={loading}
                  class="bg-cyan-500/20 hover:bg-cyan-500/30 disabled:bg-gray-500/20 text-cyan-400 hover:text-cyan-300 disabled:text-gray-500 px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 border border-cyan-500/30 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 font-mono tracking-wider"
                >
                  {loading ? "⏳" : "UPDATE"}
                </button>
              </div>
            </div>

            <!-- Agregar Miembro -->
            <div
              class="bg-gray-900/50 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm"
            >
              <h7
                class="text-green-300 font-bold text-sm mb-2 block font-mono tracking-wider"
                >➕ ADD MEMBER</h7
              >
              <div class="flex gap-2">
                <input
                  type="text"
                  bind:value={newMemberAddress}
                  placeholder="0x..."
                  class="flex-1 px-3 py-2 bg-gray-800/50 border border-green-500/30 rounded-md text-sm text-green-100 placeholder-green-500/50 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 backdrop-blur-sm font-mono"
                />
                <button
                  onclick={addMemberToClan}
                  disabled={loading || !newMemberAddress}
                  class="bg-green-500/20 hover:bg-green-500/30 disabled:bg-gray-500/20 text-green-400 hover:text-green-300 disabled:text-gray-500 px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 border border-green-500/30 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-500/20 font-mono tracking-wider"
                >
                  {loading ? "⏳" : "ADD"}
                </button>
              </div>
            </div>

            <!-- Remover Miembro -->
            <div
              class="bg-gray-900/50 border border-orange-500/30 rounded-lg p-4 backdrop-blur-sm"
            >
              <h7
                class="text-orange-300 font-bold text-sm mb-2 block font-mono tracking-wider"
                >➖ REMOVE MEMBER</h7
              >
              <div class="flex gap-2">
                <select
                  bind:value={selectedMemberToRemove}
                  class="flex-1 px-3 py-2 bg-gray-800/50 border border-orange-500/30 rounded-md text-sm text-orange-100 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 backdrop-blur-sm font-mono"
                >
                  <option value="" class="bg-gray-800 text-orange-300"
                    >Select member...</option
                  >
                  {#each clanInfo.members as member}
                    {#if member !== clanInfo.leader}
                      <option value={member} class="bg-gray-800 text-orange-100"
                        >{formatAddress(member)}</option
                      >
                    {/if}
                  {/each}
                </select>
                <button
                  onclick={() => initiateRemoveMember(selectedMemberToRemove)}
                  disabled={loading || !selectedMemberToRemove}
                  class="bg-orange-500/20 hover:bg-orange-500/30 disabled:bg-gray-500/20 text-orange-400 hover:text-orange-300 disabled:text-gray-500 px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 border border-orange-500/30 hover:border-orange-400/50 hover:shadow-lg hover:shadow-orange-500/20 font-mono tracking-wider"
                >
                  {loading ? "⏳" : "REMOVE"}
                </button>
              </div>
            </div>

            <!-- Actualizar Logo del Clan -->
            <div
              class="bg-gray-900/50 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm"
            >
              <h7
                class="text-purple-300 font-bold text-sm mb-2 block font-mono tracking-wider"
                >🎨 UPDATE CLAN LOGO</h7
              >
              <div class="flex gap-2">
                <input
                  type="url"
                  bind:value={newClanLogoUrl}
                  placeholder="https://example.com/logo.png"
                  class="flex-1 px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-md text-sm text-purple-100 placeholder-purple-500/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm font-mono"
                />
                <button
                  onclick={updateClanLogo}
                  disabled={loading || !newClanLogoUrl}
                  class="bg-purple-500/20 hover:bg-purple-500/30 disabled:bg-gray-500/20 text-purple-400 hover:text-purple-300 disabled:text-gray-500 px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 border border-purple-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 font-mono tracking-wider"
                >
                  {loading ? "⏳" : "UPDATE"}
                </button>
              </div>
            </div>
          </div>
        {/if}

        <div class="mt-4 flex justify-center">
          {#if clanInfo.leader === $address}
            <button
              onclick={initiateDissolveClan}
              disabled={loading}
              class="bg-red-500/20 hover:bg-red-500/30 disabled:bg-gray-500/20 text-red-400 hover:text-red-300 px-6 py-3 rounded-lg font-bold transition-all duration-200 border border-red-500/30 hover:border-red-400/50 cyberpunk-dissolve-btn"
            >
              {loading ? "⏳ PROCESSING..." : "🗑️ DISSOLVE CLAN"}
            </button>
          {:else}
            <button
              onclick={leaveClan}
              disabled={loading}
              class="bg-yellow-500/20 hover:bg-yellow-500/30 disabled:bg-gray-500/20 text-yellow-400 hover:text-yellow-300 px-6 py-3 rounded-lg font-bold transition-all duration-200 border border-yellow-500/30 hover:border-yellow-400/50 cyberpunk-leave-btn"
            >
              {loading ? "⏳ PROCESSING..." : "🚪 LEAVE CLAN"}
            </button>
          {/if}
        </div>
      </div>
    {:else}
      <!-- Player is not in a clan -->
      <div class="flex flex-col gap-8">
        <div
          class="bg-gray-900/90 border border-cyan-500/30 rounded-xl p-6 cyberpunk-no-clan-container backdrop-blur-sm"
        >
          <div class="text-center mb-6">
            <h5
              class="text-cyan-100 font-bold text-xl mb-2 cyberpunk-no-clan-title"
            >
              NO CLAN DETECTED
            </h5>
            <p class="text-cyan-300 text-sm cyberpunk-no-clan-subtitle">
              &gt;&gt; JOIN EXISTING CLAN OR CREATE YOUR OWN EMPIRE &lt;&lt;
            </p>
          </div>
          <h5
            class="text-purple-300 font-bold mb-4 cyberpunk-create-title font-mono tracking-wider"
          >
            ⚔️ CREATE NEW CLAN
          </h5>

          <div class="space-y-4">
            <div>
              <label
                for="clanName"
                class="block mb-2 text-cyan-300 font-bold text-sm cyberpunk-label font-mono tracking-wide"
              >
                CLAN NAME:
              </label>
              <div class="flex gap-2">
                <input
                  type="text"
                  id="clanName"
                  bind:value={newClanName}
                  placeholder="Eg: Bolta"
                  maxlength="50"
                  class="flex-1 px-3 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-sm text-cyan-100 placeholder-cyan-500/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 cyberpunk-input backdrop-blur-sm font-mono"
                />
                <button
                  onclick={generateAISuggestions}
                  disabled={$aiLoading}
                  class="cursor-pointer px-4 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 disabled:from-gray-600/20 disabled:to-gray-600/20 text-purple-300 hover:text-purple-200 disabled:text-gray-500 rounded-lg font-bold transition-all duration-200 border border-purple-500/30 hover:border-purple-400/50 disabled:border-gray-500/30 cyberpunk-ai-btn backdrop-blur-sm font-mono tracking-wider text-sm whitespace-nowrap"
                  title="Generate AI suggestions"
                >
                  {$aiLoading ? "🤖⏳" : "🤖 AI"}
                </button>
              </div>
            </div>

            <div>
              <label
                for="clanAcronym"
                class="block mb-2 text-cyan-300 font-bold text-sm cyberpunk-label font-mono tracking-wide"
              >
                ACRONYM (1-4 CHARS):
              </label>
              <input
                type="text"
                id="clanAcronym"
                bind:value={newClanAcronym}
                placeholder="Eg: Bolt"
                maxlength="4"
                class="w-full px-3 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-sm text-cyan-100 placeholder-cyan-500/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 cyberpunk-input backdrop-blur-sm font-mono tracking-widest uppercase"
              />
            </div>

            <div>
              <label
                for="clanLogo"
                class="block mb-2 text-cyan-300 font-bold text-sm cyberpunk-label font-mono tracking-wide"
              >
                LOGO URL (OPTIONAL):
              </label>
              <input
                type="url"
                id="clanLogo"
                bind:value={newClanLogo}
                placeholder="https://ejemplo.com/logo.png"
                class="w-full px-3 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-sm text-cyan-100 placeholder-cyan-500/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 cyberpunk-input backdrop-blur-sm font-mono"
              />
            </div>

            <button
              onclick={createClan}
              disabled={!newClanName || !newClanAcronym || loading}
              class=" cursor-pointer w-full bg-purple-500/20 hover:bg-purple-500/30 disabled:bg-gray-500/20 text-purple-400 hover:text-purple-300 disabled:text-gray-500 px-6 py-3 rounded-lg font-bold transition-all duration-200 border border-purple-500/30 hover:border-purple-400/50 cyberpunk-create-btn backdrop-blur-sm font-mono tracking-wider"
            >
              {loading ? "⏳ CREATING..." : "⚔️ CREATE CLAN"}
            </button>
          </div>
        </div>
      </div>
    {/if}

    <!-- Available Clans Section - Always visible -->
    <div
      class="bg-gray-900/90 border border-purple-500/30 rounded-xl p-6 cyberpunk-clan-container backdrop-blur-sm mt-6"
    >
      <h5
        class="text-purple-300 font-bold mb-4 cyberpunk-available-title font-mono tracking-wider"
      >
        📋 AVAILABLE CLANS
      </h5>
      {#if allClans.length > 0}
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-purple-500/30">
                <th
                  class="text-left p-3 text-purple-300 font-bold font-mono tracking-wider"
                  >LOGO</th
                >
                <th
                  class="text-left p-3 text-purple-300 font-bold font-mono tracking-wider"
                  >CLAN</th
                >
                <th
                  class="text-center p-3 text-purple-300 font-bold font-mono tracking-wider"
                  >MEMBERS</th
                >
                <th
                  class="text-center p-3 text-purple-300 font-bold font-mono tracking-wider"
                  >ENTRY COST</th
                >
                <th
                  class="text-center p-3 text-purple-300 font-bold font-mono tracking-wider"
                  >ACTION</th
                >
              </tr>
            </thead>
            <tbody>
              {#each allClans as clan}
                <tr
                  class="border-b border-purple-500/20 hover:bg-purple-500/10 transition-all duration-200"
                >
                  <!-- Logo Column -->
                  <td class="p-3">
                    {#if clan.logoUrl && clan.logoUrl !== ""}
                      <div
                        class="w-12 h-12 rounded-lg overflow-hidden border border-purple-500/30"
                      >
                        <img
                          src={clan.logoUrl}
                          alt="{clan.name} logo"
                          class="w-full h-full object-cover"
                          onerror={(e: any) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                          }}
                        />
                        <div
                          class="w-full h-full bg-gray-800/50 border border-purple-500/30 rounded-lg flex items-center justify-center text-purple-400 text-xs font-mono"
                          style="display: none;"
                        >
                          NO IMG
                        </div>
                      </div>
                    {:else}
                      <div
                        class="w-12 h-12 bg-gray-800/50 border border-purple-500/30 rounded-lg flex items-center justify-center text-purple-400 text-xs font-mono"
                      >
                        NO IMG
                      </div>
                    {/if}
                  </td>

                  <!-- Clan Name Column -->
                  <td class="p-3">
                    <div>
                      <h6
                        class="font-bold text-purple-400 cyberpunk-clan-name font-mono tracking-wide"
                      >
                        [{clan.acronym}] {clan.name}
                      </h6>
                    </div>
                  </td>

                  <!-- Members Column -->
                  <td class="p-3 text-center">
                    <span
                      class="text-cyan-300 font-mono tracking-wider font-bold"
                    >
                      {clan.memberCount}
                    </span>
                  </td>

                  <!-- Entry Cost Column -->
                  <td class="p-3 text-center">
                    {#if clan.joinPrice > 0}
                      <span class="text-orange-400 font-bold font-mono">
                        {(Number(clan.joinPrice) / 1e18).toFixed(4)} ETH
                      </span>
                    {:else}
                      <span class="text-green-400 font-bold font-mono">
                        FREE
                      </span>
                    {/if}
                  </td>

                  <!-- Action Column -->
                  <td class="p-3 text-center">
                    <button
                      onclick={() => joinClan(clan.name)}
                      disabled={loading ||
                        (clanInfo && clanInfo.name === clan.name)}
                      class="cursor-pointer bg-green-500/20 hover:bg-green-500/30 disabled:bg-gray-500/20 text-green-400 hover:text-green-300 disabled:text-gray-500 px-4 py-2 rounded-lg font-bold transition-all duration-200 border border-green-500/30 hover:border-green-400/50 cyberpunk-join-btn font-mono tracking-wider"
                    >
                      {loading
                        ? "⏳"
                        : clanInfo && clanInfo.name === clan.name
                          ? "JOINED"
                          : "JOIN"}
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <div class="text-center py-8 cyberpunk-no-clans">
          <div class="text-5xl mb-4 text-cyan-400">⚔️</div>
          <p class="mb-2 text-cyan-300 font-bold font-mono tracking-wider">
            NO CLANS DETECTED
          </p>
          <p class="text-sm text-cyan-500 font-mono tracking-wide">
            &gt;&gt;&gt; BE THE FIRST TO CREATE ONE! &lt;&lt;
          </p>
        </div>
      {/if}
    </div>

    <!-- Contenido adicional para forzar scroll -->
    <div
      class="mt-8 p-4 bg-gray-900/50 border border-purple-500/30 rounded-lg backdrop-blur-sm"
    >
      <h6 class="text-purple-300 font-bold mb-2 font-mono tracking-wider">
        ADDITIONAL INFORMATION
      </h6>
      <div class="space-y-2 text-sm text-purple-200/80 font-mono">
        <p>• Clans allow team competition</p>
        <p>• You can create your own clan or join an existing one</p>
        <p>• Leaders can dissolve their clans</p>
        <p>• Members can leave the clan at any time</p>
        <p>• Some clans may have an entry fee</p>
        <p>• Clan acronym must be between 1 and 4 characters</p>
        <p>• Clan name can be up to 50 characters</p>
        <p>• Clans are stored on the blockchain</p>
      </div>
    </div>

    <div
      class="mt-6 p-4 bg-gray-900/50 border border-cyan-500/30 rounded-lg backdrop-blur-sm"
    >
      <h6 class="text-cyan-300 font-bold mb-2 font-mono tracking-wider">
        STATISTICS
      </h6>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div
          class="text-center p-3 bg-gray-800/50 border border-cyan-500/20 rounded backdrop-blur-sm"
        >
          <div class="text-2xl font-bold text-cyan-400 font-mono">
            {allClans.length}
          </div>
          <div class="text-cyan-300/80 font-mono tracking-wide">
            Total Clans
          </div>
        </div>
        <div
          class="text-center p-3 bg-gray-800/50 border border-green-500/20 rounded backdrop-blur-sm"
        >
          <div class="text-2xl font-bold text-green-400 font-mono">
            {allClans.filter((c: any) => c.joinPrice === 0).length}
          </div>
          <div class="text-green-300/80 font-mono tracking-wide">
            Free Clans
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- AI Suggestions Modal -->
{#if showAISuggestions}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
    onclick={() => (showAISuggestions = false)}
  >
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="bg-gray-900/95 border border-purple-500/50 rounded-lg p-6 max-w-md w-full mx-4 backdrop-blur-md"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-purple-300 font-bold text-lg font-mono tracking-wider">
          🤖 AI CLAN SUGGESTIONS
        </h3>
        <button
          onclick={() => (showAISuggestions = false)}
          class="text-gray-400 hover:text-white text-xl">&times;</button
        >
      </div>

      <div class="mb-4">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label
          class="block mb-2 text-cyan-300 font-bold text-sm font-mono tracking-wide"
          >PREFERENCES (OPTIONAL):</label
        >
        <input
          type="text"
          bind:value={aiPreferences}
          placeholder="e.g., futuristic, warrior, tech-themed..."
          class="w-full px-3 py-2 bg-gray-800/50 border border-cyan-500/30 rounded text-sm text-cyan-100 placeholder-cyan-500/50 focus:outline-none focus:border-cyan-400 font-mono"
        />
      </div>

      <button
        onclick={generateAISuggestions}
        disabled={$aiLoading}
        class="w-full mb-4 px-4 py-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/40 hover:to-pink-600/40 disabled:from-gray-600/20 disabled:to-gray-600/20 text-purple-300 hover:text-purple-200 disabled:text-gray-500 rounded font-bold transition-all duration-200 border border-purple-500/30 hover:border-purple-400/50 disabled:border-gray-500/30 font-mono tracking-wider"
      >
        {$aiLoading ? "🤖 GENERATING..." : "🤖 GENERATE SUGGESTIONS"}
      </button>

      {#if aiSuggestions.length > 0}
        <div class="space-y-2 max-h-60 overflow-y-auto">
          {#each aiSuggestions as suggestion}
            <div
              class="p-3 bg-gray-800/50 border border-cyan-500/20 rounded hover:border-cyan-400/40 transition-colors cursor-pointer"
              onclick={() => selectAISuggestion(suggestion)}
            >
              <div class="font-bold text-cyan-300 font-mono">
                {suggestion.name}
              </div>
              <div class="text-purple-300 text-sm font-mono">
                [{suggestion.acronym}]
              </div>
              {#if suggestion.description}
                <div class="text-gray-400 text-xs mt-1">
                  {suggestion.description}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- Confirm Dialogs -->
<ConfirmDialog
  bind:isOpen={showDissolveClanDialog}
  title="Dissolve Clan"
  message={`Are you sure you want to dissolve the clan "${clanInfo?.name}"? This action cannot be undone.`}
  confirmText="Dissolve"
  cancelText="Cancel"
  type="danger"
  on:confirm={confirmDissolveClan}
  on:cancel={() => (showDissolveClanDialog = false)}
/>

<ConfirmDialog
  bind:isOpen={showRemoveMemberDialog}
  title="Remove Member"
  message={`Are you sure you want to remove ${formatAddress(memberToRemove)} from the clan?`}
  confirmText="Remove"
  cancelText="Cancel"
  type="warning"
  on:confirm={confirmRemoveMember}
  on:cancel={() => (showRemoveMemberDialog = false)}
/>

<style>
  /* Cyberpunk Scrollbar */
  .cyberpunk-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #06b6d4 #1f2937;
  }

  .cyberpunk-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .cyberpunk-scrollbar::-webkit-scrollbar-track {
    background: #1f2937;
    border-radius: 3px;
  }

  .cyberpunk-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #06b6d4, #8b5cf6);
    border-radius: 3px;
  }

  .cyberpunk-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, #0891b2, #7c3aed);
  }

  /* Main Container */
  .cyberpunk-main-container {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    border: 1px solid rgba(6, 182, 212, 0.3);
    box-shadow: 0 0 20px rgba(6, 182, 212, 0.1);
  }

  /* Titles */
  .cyberpunk-main-title {
    text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
    animation: pulse-cyan 2s infinite;
  }

  .cyberpunk-subtitle {
    font-family: "Courier New", monospace;
    letter-spacing: 1px;
  }

  /* Buttons */
  .cyberpunk-refresh-btn {
    box-shadow: 0 0 15px rgba(6, 182, 212, 0.2);
    transition: all 0.3s ease;
  }

  .cyberpunk-refresh-btn:hover {
    box-shadow: 0 0 25px rgba(6, 182, 212, 0.4);
    transform: translateY(-1px);
  }

  /* Clan Container */
  .cyberpunk-clan-container {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.2);
  }

  .cyberpunk-clan-header {
    background: linear-gradient(
      90deg,
      rgba(139, 92, 246, 0.1) 0%,
      transparent 100%
    );
  }

  .cyberpunk-clan-name {
    text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
  }

  .cyberpunk-member-count {
    animation: pulse-purple 3s infinite;
  }

  /* Info Rows */
  .cyberpunk-info-row {
    padding: 8px 0;
    border-bottom: 1px solid rgba(6, 182, 212, 0.1);
  }

  .cyberpunk-label {
    font-family: "Courier New", monospace;
    letter-spacing: 1px;
  }

  .cyberpunk-address {
    background: rgba(6, 182, 212, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid rgba(6, 182, 212, 0.3);
  }

  /* Member Items */
  .cyberpunk-member-item {
    background: linear-gradient(
      90deg,
      rgba(6, 182, 212, 0.05) 0%,
      rgba(139, 92, 246, 0.05) 100%
    );
    transition: all 0.3s ease;
  }

  .cyberpunk-member-item:hover {
    background: linear-gradient(
      90deg,
      rgba(6, 182, 212, 0.1) 0%,
      rgba(139, 92, 246, 0.1) 100%
    );
    transform: translateX(5px);
  }

  .cyberpunk-crown {
    filter: drop-shadow(0 0 5px #fbbf24);
  }

  /* Action Buttons */
  .cyberpunk-dissolve-btn,
  .cyberpunk-leave-btn {
    transition: all 0.3s ease;
  }

  .cyberpunk-dissolve-btn:hover {
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
  }

  .cyberpunk-leave-btn:hover {
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
  }

  /* No Clan Container */
  .cyberpunk-no-clan-container {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    box-shadow: 0 0 30px rgba(6, 182, 212, 0.2);
  }

  .cyberpunk-no-clan-title {
    text-shadow: 0 0 15px rgba(6, 182, 212, 0.6);
    animation: pulse-cyan 2s infinite;
  }

  .cyberpunk-no-clan-subtitle {
    font-family: "Courier New", monospace;
    letter-spacing: 2px;
  }

  /* Form Inputs */
  .cyberpunk-input {
    transition: all 0.3s ease;
    font-family: "Courier New", monospace;
  }

  .cyberpunk-input:focus {
    box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
  }

  /* Create Button */
  .cyberpunk-create-btn {
    transition: all 0.3s ease;
  }

  .cyberpunk-create-btn:hover {
    box-shadow: 0 0 25px rgba(139, 92, 246, 0.4);
    transform: translateY(-2px);
  }

  /* Clan Items */
  .cyberpunk-clan-item {
    transition: all 0.3s ease;
  }

  .cyberpunk-clan-item:hover {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
    transform: translateY(-2px);
  }

  .cyberpunk-join-btn {
    transition: all 0.3s ease;
  }

  .cyberpunk-join-btn:hover {
    box-shadow: 0 0 15px rgba(34, 197, 94, 0.4);
  }

  /* Animations */
  @keyframes pulse-cyan {
    0%,
    100% {
      text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
    }
    50% {
      text-shadow:
        0 0 20px rgba(6, 182, 212, 0.8),
        0 0 30px rgba(6, 182, 212, 0.3);
    }
  }

  @keyframes pulse-purple {
    0%,
    100% {
      box-shadow: 0 0 5px rgba(139, 92, 246, 0.3);
    }
    50% {
      box-shadow:
        0 0 15px rgba(139, 92, 246, 0.6),
        0 0 25px rgba(139, 92, 246, 0.2);
    }
  }
</style>
