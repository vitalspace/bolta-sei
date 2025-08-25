<script lang="ts">
  import { chatStore } from "#stores/chatStore";
  import { wsService } from "#websockets/websockets";
  import { type WebSocketMessage } from "#types/ws";

  const { status, messages } = wsService;

  let chatInput: HTMLInputElement;

  // Acceder al estado del store
  const isVisible = $derived($chatStore.isVisible);
  const inputText = $derived($chatStore.inputText);
  const userMessages = $derived($chatStore.messages);
  const isClearing = $derived($chatStore.isClearing);

  // Manejar eventos de teclado
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "t" || event.key === "T") {
      // Solo activar si no estamos escribiendo en un input
      if (
        event.target === document.body ||
        !(event.target as HTMLElement).matches("input, textarea")
      ) {
        event.preventDefault();
        chatStore.toggleChat();
      }
    }
  }

  // Manejar Enter en el input del chat
  function handleChatKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    } else if (event.key === "Escape") {
      event.preventDefault();
      chatStore.hideChat();
    }
  }

  // Función local para enviar mensaje
  function sendMessage() {
    const trimmedText = inputText.trim();
    if (trimmedText !== "" && trimmedText.length <= 64) {
      wsService.send({ type: "chat", message: trimmedText });
      chatStore.updateInputText("");
      chatStore.hideChat();
    }
  }

  // Efecto para manejar eventos de teclado globales
  $effect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  });

  // Efecto para enfocar el input cuando se abre el chat
  $effect(() => {
    if (isVisible && chatInput) {
      setTimeout(() => {
        chatInput?.focus();
      }, 100);
    }
  });

  messages.subscribe((msg: WebSocketMessage | null) => {
    if (msg?.type === "chat") {
      chatStore.addWebSocketMessage(msg.message, msg.id);
    }
  });
</script>

<!-- Chat Container -->
{#if userMessages.length > 0 || isVisible}
  <div class="fixed z-40 h-screen place-content-center">
    <div
      class="grid gap-2 rounded-md p-2 bg-opacity-80 backdrop-blur-sm w-60 mx-8"
    >
      <!-- Este div siempre se ve porque son los chats actuales -->
      {#if userMessages.length > 0}
        <div
          class="chats text-white transition-all duration-500 {isClearing
            ? 'opacity-0 blur-sm scale-95'
            : 'opacity-100 blur-0 scale-100'}"
        >
          {#each userMessages as message (message.id)}
            <p
              class="mb-2 break-words transition-all duration-500 ease-out {message.isRemoving
                ? 'opacity-0 blur-sm scale-90 transform translate-x-6 -translate-y-2'
                : 'opacity-100 blur-0 scale-100 transform translate-x-0 translate-y-0'}"
            >
              {message.text}
            </p>
          {/each}
        </div>
      {/if}

      <!-- Este contenido no se ve hasta que el usuario presiona t -->
      {#if isVisible}
        <div>
          <div class="flex bg-white">
            <input
              bind:this={chatInput}
              value={inputText}
              oninput={(e: any) => {
                const value = e.target.value;
                if (value.length <= 64) {
                  chatStore.updateInputText(value);
                }
              }}
              onkeydown={handleChatKeydown}
              type="text"
              maxlength="64"
              class="w-full bg-none px-2 outline-none text-black"
              placeholder="Escribe tu mensaje..."
            />
            <button
              onclick={sendMessage}
              class="cursor-pointer bg-green-400 px-2 py-2 text-white transition-colors hover:bg-green-500"
            >
              Send
            </button>
          </div>
          <div class="text-xs text-gray-400 px-2 py-1">
            {inputText.length}/64 characters
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}
