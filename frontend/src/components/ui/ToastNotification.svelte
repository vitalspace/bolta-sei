<script lang="ts">
  import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-svelte";
  import { fly } from "svelte/transition";
  import { toastStore } from "#stores/toastStore";

  // Subscribe to the toast store
  $: toasts = $toastStore;

  function removeToast(id: string) {
    toastStore.removeToast(id);
  }
</script>

<!-- Toast Container - Fixed to viewport -->
<div class="fixed bottom-4 right-4 z-[99999] flex flex-col gap-3 pointer-events-none">
  {#each toasts as toast (toast.id)}
    <div 
      class="pointer-events-auto min-w-80 max-w-96 rounded-lg border-2 backdrop-blur-xl shadow-2xl overflow-hidden {toast.type === 'success' ? 'bg-green-500/15 border-green-500/40' : toast.type === 'error' ? 'bg-red-500/15 border-red-500/40' : toast.type === 'warning' ? 'bg-amber-500/15 border-amber-500/40' : 'bg-blue-500/15 border-blue-500/40'}"
      in:fly={{ x: 300, duration: 300 }}
      out:fly={{ x: 300, duration: 300 }}
    >
      <div class="flex items-center p-4 gap-3">
        <div class="flex-shrink-0 flex items-center justify-center">
          {#if toast.type === 'success'}
            <CheckCircle class="w-6 h-6 text-green-400 drop-shadow-[0_0_8px_rgba(34,255,34,0.8)] stroke-[2.5]" />
          {:else if toast.type === 'error'}
            <XCircle class="w-6 h-6 text-red-400 drop-shadow-[0_0_8px_rgba(255,51,51,0.8)] stroke-[2.5]" />
          {:else if toast.type === 'warning'}
            <AlertCircle class="w-6 h-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(255,204,0,0.8)] stroke-[2.5]" />
          {:else}
            <Info class="w-6 h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(51,153,255,0.8)] stroke-[2.5]" />
          {/if}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium font-mono tracking-wide {toast.type === 'success' ? 'text-green-200' : toast.type === 'error' ? 'text-red-200' : toast.type === 'warning' ? 'text-amber-200' : 'text-blue-200'}">
            {toast.message}
          </p>
        </div>
        <button 
          class="flex-shrink-0 bg-black/40 border border-white/30 rounded-md w-7 h-7 flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-sm hover:bg-red-600/30 hover:border-red-600/60 hover:scale-105 hover:shadow-[0_0_10px_rgba(220,38,38,0.3)]"
          on:click={() => removeToast(toast.id)}
          type="button"
        >
          <X class="w-4 h-4 text-white/90 stroke-2 hover:text-white" />
        </button>
      </div>
    </div>
  {/each}
</div>