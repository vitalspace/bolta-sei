<script lang="ts">
  import {
    Crown,
    Clock,
    DollarSign,
    ShoppingBag,
    Star,
    Zap,
    Wallet,
  } from "lucide-svelte";

  import { showShop } from "#stores/shopStore";
</script>

{#if !$showShop}
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4"
  >
    <div class="max-w-6xl mx-auto space-y-8">
      <div class="text-center py-12">
        <div class="flex items-center justify-center gap-3 mb-6">
          <ShoppingBag class="h-10 w-10 text-blue-600" />
          <h1
            class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Premium Store
          </h1>
        </div>
        <p class="text-muted-foreground text-xl max-w-2xl mx-auto">
          Discover our exclusive products and join the premium community
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- VIP Membership Product -->
        <div
          class="relative overflow-hidden border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:scale-105 bg-white dark:bg-gray-800 rounded-lg"
        >
          <div class="absolute top-4 right-4">
            <span
              class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-medium"
              >Popular</span
            >
          </div>
          <div class="p-6 pb-4">
            <div class="flex items-center gap-3 mb-2">
              <Crown class="h-8 w-8 text-purple-600" />
              <h3 class="text-2xl font-semibold">Membresía VIP</h3>
            </div>
            <p class="text-muted-foreground text-base mb-4">
              Acceso exclusivo a funciones premium y beneficios especiales
            </p>
          </div>
          <div class="px-6 pb-6 space-y-4">
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-purple-600">{1}</span>
              <span class="text-muted-foreground">ETH</span>
              <span class="text-sm text-muted-foreground">/ 30 días</span>
            </div>

            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <Star class="h-4 w-4 text-yellow-500" />
                <span class="text-sm">Acceso a contenido exclusivo</span>
              </div>
              <div class="flex items-center gap-2">
                <Zap class="h-4 w-4 text-blue-500" />
                <span class="text-sm">Funciones premium desbloqueadas</span>
              </div>
              <div class="flex items-center gap-2">
                <Crown class="h-4 w-4 text-purple-500" />
                <span class="text-sm">Estado VIP por 30 días</span>
              </div>
            </div>

            <button
              onclick={() => {}}
              class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer"
            >
              Ver Detalles
            </button>
          </div>
        </div>

        <!-- Placeholder Products -->
        <div class="opacity-60 bg-white dark:bg-gray-800 rounded-lg border">
          <div class="p-6 pb-4">
            <div class="flex items-center gap-3 mb-2">
              <Zap class="h-8 w-8 text-blue-600" />
              <h3 class="text-2xl font-semibold">Premium Tools</h3>
            </div>
            <p class="text-muted-foreground">
              Herramientas avanzadas para usuarios profesionales
            </p>
          </div>
          <div class="px-6 pb-6">
            <div class="flex items-baseline gap-2 mb-4">
              <span class="text-3xl font-bold text-blue-600">0.05</span>
              <span class="text-muted-foreground">ETH</span>
            </div>
            <button
              disabled
              class="w-full bg-gray-300 text-gray-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed"
            >
              Próximamente
            </button>
          </div>
        </div>

        <div class="opacity-60 bg-white dark:bg-gray-800 rounded-lg border">
          <div class="p-6 pb-4">
            <div class="flex items-center gap-3 mb-2">
              <Star class="h-8 w-8 text-yellow-600" />
              <h3 class="text-2xl font-semibold">Elite Access</h3>
            </div>
            <p class="text-muted-foreground">
              Acceso de por vida a todas las funciones premium
            </p>
          </div>
          <div class="px-6 pb-6">
            <div class="flex items-baseline gap-2 mb-4">
              <span class="text-3xl font-bold text-yellow-600">1.0</span>
              <span class="text-muted-foreground">ETH</span>
            </div>
            <button
              disabled
              class="w-full bg-gray-300 text-gray-500 font-medium py-3 px-4 rounded-lg cursor-not-allowed"
            >
              Próximamente
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
