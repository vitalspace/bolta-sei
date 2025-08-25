<script lang="ts">
  import {
    currentSongUrl,
    hideHtmlElements,
    showYouTubeDialog,
  } from "#stores/parkStores";
  import { type WebSocketMessage } from "#types/ws";

  import { getSound } from "#lib/utils/music";
  import { wsService } from "#websockets/websockets";

  const { messages } = wsService;

  let inputRef = $state<HTMLInputElement>();
  let url = $state("");
  let isValidUrl = $state(false);
  let isLoading = $state(false);
  let audioUrl = $state<string | null>(null);
  let showDialog = $state(false);

  const isValidYouTubeUrl = (url: string): boolean => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+(&[\w=]*)?$/;
    return youtubeRegex.test(url);
  };

  messages.subscribe((message: WebSocketMessage | null) => {
    if (message) {
      if (message.type === "music") {
        const { song } = message;

        console.log("Received music message:", song.link);
        currentSongUrl.set(song.link);
      }
    }
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (isValidUrl && !isLoading) {
      try {
        isLoading = true;

        wsService.send({ type: "music", url: url });

        // const songUrl = await getSound(url);

        // console.log("Song URL:", songUrl);

        // if (songUrl) {
        //   audioUrl = songUrl.link;
        //   currentSongUrl.set(songUrl.link);
        //   console.log("Audio URL obtained:", songUrl.link);
        handleClose();
        // } else {
        //   console.error("Could not get audio URL");
        // }
      } catch (error) {
        console.error("Error processing YouTube URL:", error);
      } finally {
        isLoading = false;
      }
    }
  };

  const handleClose = () => {
    showDialog = false;
    setTimeout(() => {
      showYouTubeDialog.set(false);
      hideHtmlElements.set(false);
      url = "";
      isValidUrl = false;
      isLoading = false;
      audioUrl = null;
    }, 200);
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Auto-focus input when dialog opens and hide HTML elements
  $effect(() => {
    if ($showYouTubeDialog) {
      hideHtmlElements.set(true);
      showDialog = true;
      setTimeout(() => {
        if (inputRef) {
          inputRef.focus();
        }
      }, 100);
    }
  });

  // Update validation when url changes
  $effect(() => {
    isValidUrl = isValidYouTubeUrl(url);
  });
</script>

{#if $showYouTubeDialog}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-200"
    class:opacity-100={showDialog}
    class:opacity-0={!showDialog}
    onkeydown={(e) => e.stopPropagation()}
    onkeyup={(e) => e.stopPropagation()}
    onclick={handleBackdropClick}
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-200 border border-gray-100"
      class:scale-100={showDialog}
      class:scale-95={!showDialog}
      onkeydown={(e) => e.stopPropagation()}
      onkeyup={(e) => e.stopPropagation()}
      onclick={(e) => e.stopPropagation()}
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 pb-4 border-b border-gray-100"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-red-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
              />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              Add YouTube Video
            </h2>
            <p class="text-sm text-gray-500">
              Extract audio from YouTube video
            </p>
          </div>
        </div>
        <button
          aria-label="Close"
          onclick={handleClose}
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <form onsubmit={handleSubmit} class="p-6">
        <div class="space-y-4">
          <div>
            <label
              for="youtube-url"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              YouTube URL
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <input
                bind:this={inputRef}
                bind:value={url}
                id="youtube-url"
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                class="w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-sm"
                class:border-gray-300={!url}
                class:border-red-300={url && !isValidUrl}
                class:bg-red-50={url && !isValidUrl}
                class:border-green-300={isValidUrl}
                class:bg-green-50={isValidUrl}
                onkeydown={(e) => e.stopPropagation()}
                onkeyup={(e) => e.stopPropagation()}
                onkeypress={(e) => e.stopPropagation()}
              />
              {#if isValidUrl}
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg
                    class="h-5 w-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              {:else if url && !isValidUrl}
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg
                    class="h-5 w-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              {/if}
            </div>

            {#if url && !isValidUrl}
              <div class="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                Please enter a valid YouTube URL
              </div>
            {:else if isValidUrl}
              <div class="flex items-center gap-2 mt-2 text-green-600 text-sm">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                Valid YouTube URL detected
              </div>
            {/if}
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              aria-label="Cancel"
              onclick={handleClose}
              class="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              aria-label="Add Video"
              disabled={!isValidUrl || isLoading}
              class="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm shadow-lg shadow-red-500/25"
            >
              {#if isLoading}
                <div
                  class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></div>
                Processing...
              {:else}
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Video
              {/if}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
{/if}
