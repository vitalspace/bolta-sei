<script lang="ts">
  import { onMount } from "svelte";
  import { wsService } from "#websockets/websockets";
  // wsMessages will be accessed through wsService.messages
  import { useAI } from "#hooks/useAI";
  import { aiChatStore } from "#stores/aiChatStore";

  interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
  }

  let locationsArray = [
    {
      name: "Racing Track",
      position: {
        x: 253,
        y: 6, // Just above the road area at Y=3
        z: 190,
      },
    },
    {
      name: "Shop",
      position: {
        x: 10,
        y: 3,
        z: 20,
      },
    },
    {
      name: "City",
      position: {
        x: 30,
        y: 3,
        z: 20,
      },
    },
    {
      name: "park",
      position: {
        x: 0,
        y: 3,
        z: 0,
      },
    },
    {
      name: "space_station",
      position: {
        x: -40,
        y: 3,
        z: 53.49,
      },
    },
  ];

  let messages: Message[] = $state([]);
  let inputText = $state("");
  let isLoading = $state(false);
  let playerId = $state<string | null>(null);
  let chatContainer: HTMLElement;

  // Initialize AI hook
  const { generateResponse, isLoading: aiLoading } = useAI();

  // Game information for AI context
  const gameInfo = {
    locations: [
      {
        name: "Racing Track",
        description:
          "A racing circuit where you can compete with other players",
      },
      {
        name: "Shop",
        description:
          "A store where you can buy vehicles, upgrades and accessories",
      },
      {
        name: "City",
        description: "The main city area with various buildings and activities",
      },
      {
        name: "park",
        description:
          "A relaxation area where you can socialize with other players",
      },
      {
        name: "space_station",
        description:
          "A futuristic space station with advanced technology and zero gravity areas",
      },
    ],
    controls: [
      { key: "WASD", action: "Move vehicle" },
      { key: "Space", action: "Handbrake" },
      { key: "Shift", action: "Turbo" },
      { key: "T", action: "Chat" },
      { key: "H", action: "AI Chat" },
    ],
    features: [
      "Real-time multiplayer racing",
      "Purchase and upgrade system",
      "Live chat with other players",
      "Different locations to explore",
    ],
  };

  // Location mapping for WebSocket messages
  const locationMapping = {
    "Racing Track": "racing",
    Shop: "shop",
    City: "city",
    park: "park",
    space_station: "space_station",
  };

  function addMessage(text: string, isUser: boolean = false) {
    const message: Message = {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${performance.now()}`,
      text,
      isUser,
      timestamp: new Date(),
    };
    messages = [...messages, message];

    // Auto scroll to bottom
    setTimeout(() => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  function navigateToLocation(locationName: string) {
    // if (!playerId) {
    //   addMessage("❌ Error: Could not get player ID. Try reconnecting.");
    //   return;
    // }

    // Find location in locationsArray
    const location = locationsArray.find((loc) => loc.name === locationName);
    if (!location) {
      addMessage(`❌ Error: Location "${locationName}" not found.`);
      return;
    }

    // Get locationId from mapping for backward compatibility
    const locationId =
      locationMapping[locationName as keyof typeof locationMapping];

    console.log(locationId);

    // try {

    wsService.send({
      type: "location:enter",
      // playerId: playerId,
      locationId: locationId,
      locationName: locationName,
      position: location.position, // Send the coordinates
    });
    addMessage(
      `🚀 Teleporting to ${locationName} at coordinates (${location.position.x}, ${location.position.y}, ${location.position.z})...`
    );
    // } catch (error) {
    //   addMessage(`❌ Error sending request: ${error}`);
    // }
  }

  async function sendMessage() {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    addMessage(userMessage, true);
    inputText = "";
    isLoading = true;

    try {
      const systemPrompt = `You are an AI assistant for a multiplayer racing game. 
      
Game information:
      - Available locations: ${gameInfo.locations.map((l) => `${l.name} (${l.description})`).join(", ")}
      - Controls: ${gameInfo.controls.map((c) => `${c.key}: ${c.action}`).join(", ")}
      - Features: ${gameInfo.features.join(", ")}
      
      If the user asks about locations or wants to go somewhere, mention the available locations.
      
      Respond in English in a helpful and friendly manner.`;

      const aiContext = {
        type: "game_guide" as const,
        systemPrompt: systemPrompt,
        temperature: 0.7,
        maxTokens: 500,
      };

      const result = await generateResponse(aiContext, userMessage);

      if (result.error) {
        throw new Error(result.error);
      }

      const response = result.content;

      // Check if response mentions specific locations or user asks for navigation
      const mentionsSpecificLocations = gameInfo.locations.some(
        (location) =>
          response.toLowerCase().includes(location.name.toLowerCase()) ||
          userMessage.toLowerCase().includes(location.name.toLowerCase())
      );

      const asksForNavigation =
        userMessage.toLowerCase().includes("go to") ||
        userMessage.toLowerCase().includes("navigate") ||
        userMessage.toLowerCase().includes("teleport") ||
        userMessage.toLowerCase().includes("travel") ||
        userMessage.toLowerCase().includes("where can i go") ||
        userMessage.toLowerCase().includes("locations") ||
        userMessage.toLowerCase().includes("places");

      const mentionsLocations = mentionsSpecificLocations || asksForNavigation;

      if (mentionsLocations) {
        addMessage(response + "\n\n🎯 **Quick Navigation:**");

        // Add location buttons
        gameInfo.locations.forEach((location) => {
          const buttonMessage = `<button class="location-btn" data-location="${location.name}">📍 Go to ${location.name}</button>`;
          addMessage(buttonMessage);
        });
      } else {
        addMessage(response);
      }
    } catch (error) {
      addMessage("❌ Error getting AI response. Please try again.");
    } finally {
      isLoading = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function handleLocationClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains("location-btn")) {
      const locationName = target.getAttribute("data-location");
      if (locationName) {
        navigateToLocation(locationName);
      }
    }
  }

  onMount(() => {
    // Add welcome message
    addMessage(
      "🤖 Hello! I'm your AI game assistant. I can help you with information about locations, controls and game features. How can I help you?"
    );

    // Listen to WebSocket messages
    const unsubscribe = wsService.messages.subscribe((message) => {
      if (message) {
        // Capture playerId when connected
        if (message.playerId && !playerId) {
          playerId = message.playerId;
        }

        // Handle location enter response
        if (message.type === "location:enter_response") {
          if (message.success) {
            addMessage(
              `✅ Successfully teleported to ${message.locationName || "the new location"}!`
            );
          } else {
            addMessage(
              `❌ Teleportation error: ${message.error || "Unknown error"}`
            );
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  });
</script>

<!-- AI Chat Modal -->
<div
  class="fixed inset-y-0 right-0 w-96 bg-gray-900/95 backdrop-blur-xl border-l border-cyan-500/30 shadow-2xl shadow-cyan-500/20 flex flex-col overflow-hidden z-50 cyberpunk-container"
>
  <!-- Header -->
  <div
    class="flex justify-between items-center px-6 py-4 border-b border-cyan-500/30 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-cyan-100 cyberpunk-header"
  >
    <h2
      class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 cyberpunk-title flex items-center gap-2"
    >
      🤖 AI GAME ASSISTANT
    </h2>
    <button
      class="group relative w-8 h-8 flex items-center justify-center rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 active:bg-cyan-500/30 transition-all duration-200 transform hover:scale-105 active:scale-95 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400/50 cyberpunk-close-btn"
      onclick={() => aiChatStore.close()}
      title="Close AI Chat"
    >
      <svg
        class="w-4 h-4 text-cyan-400 transition-transform duration-200 group-hover:rotate-90 group-hover:text-cyan-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
      <div
        class="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 cyberpunk-glow"
      ></div>
    </button>
  </div>

  <!-- Messages Container -->
  <div
    bind:this={chatContainer}
    class="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-cyan-500/50"
    onclick={handleLocationClick}
  >
    {#each messages as message (message.id)}
      <div class="flex {message.isUser ? 'justify-end' : 'justify-start'}">
        <div
          class="max-w-xs px-3 py-2 rounded-lg {message.isUser
            ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-gray-100 border border-cyan-500/30 shadow-lg shadow-cyan-500/20'
            : 'bg-gradient-to-r from-purple-600/20 to-gray-700/50 text-gray-100 border border-purple-500/30 shadow-lg shadow-purple-500/20'} text-sm"
        >
          <div class="whitespace-pre-wrap">
            {@html message.text.replace(
              /<button class="location-btn" data-location="([^"]+)">([^<]+)<\/button>/g,
              '<button class="location-btn bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 shadow-lg" data-location="$1">$2</button>'
            )}
          </div>
          <div class="text-xs opacity-70 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    {/each}

    {#if isLoading}
      <div class="flex justify-start">
        <div
          class="bg-gradient-to-r from-purple-600/20 to-gray-700/50 text-gray-100 px-3 py-2 rounded-lg border border-purple-500/30 text-sm"
        >
          <div class="flex items-center gap-2">
            <div
              class="animate-spin w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full"
            ></div>
            AI is thinking...
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Input Area -->
  <div
    class="border-t border-cyan-500/30 p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50"
  >
    <div class="flex flex-col gap-2">
      <input
        bind:value={inputText}
        onkeydown={handleKeydown}
        placeholder="Ask about game controls, locations, or gameplay..."
        class="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 text-sm"
        disabled={isLoading}
      />
      <button
        onclick={sendMessage}
        disabled={isLoading || !inputText.trim()}
        class="w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 disabled:shadow-none hover:scale-105 disabled:scale-100 text-sm"
      >
        {#if isLoading}
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        {:else}
          Send
        {/if}
      </button>
    </div>
    <div class="text-xs text-gray-400 mt-2">
      Press Enter to send • Shift+Enter for new line
    </div>
  </div>
</div>

<style>
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

  .animate-fade-in {
    animation: fadeIn 0.3s ease-in;
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

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  :global(.location-btn) {
    cursor: pointer;
    margin: 2px;
    display: inline-block;
  }

  :global(.location-btn:hover) {
    transform: scale(1.05);
  }
</style>
