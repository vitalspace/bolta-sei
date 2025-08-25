<script lang="ts">
  import { X } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';

  export let isOpen = false;
  export let title = 'Confirm Action';
  export let message = 'Are you sure you want to proceed?';
  export let confirmText = 'Confirm';
  export let cancelText = 'Cancel';
  export let type: 'danger' | 'warning' | 'info' = 'warning';

  const dispatch = createEventDispatcher();

  const handleConfirm = () => {
    dispatch('confirm');
    isOpen = false;
  };

  const handleCancel = () => {
    dispatch('cancel');
    isOpen = false;
  };

  const handleBackdropClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleCancel();
    }
  };
</script>

{#if isOpen}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    on:click={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby="dialog-title"
  >
    <!-- Dialog -->
    <div class="bg-gray-900/95 border border-cyan-500/30 rounded-lg shadow-2xl max-w-md w-full backdrop-blur-md">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-700/50">
        <h3 id="dialog-title" class="text-lg font-semibold text-white">
          {title}
        </h3>
        <button
          on:click={handleCancel}
          class="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-700/50"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <p class="text-gray-300 leading-relaxed">
          {message}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 p-6 pt-0">
        <button
          on:click={handleCancel}
          class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors border border-gray-600 hover:border-gray-500"
        >
          {cancelText}
        </button>
        <button
          on:click={handleConfirm}
          class="flex-1 px-4 py-2 rounded-md transition-all font-medium
            {type === 'danger' ? 'bg-red-600 hover:bg-red-500 text-white border border-red-500 hover:border-red-400 shadow-lg shadow-red-500/25' :
             type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-500 text-white border border-yellow-500 hover:border-yellow-400 shadow-lg shadow-yellow-500/25' :
             'bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-500 hover:border-cyan-400 shadow-lg shadow-cyan-500/25'}"
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Ensure dialog appears above everything */
  :global(.dialog-backdrop) {
    z-index: 9999;
  }
</style>