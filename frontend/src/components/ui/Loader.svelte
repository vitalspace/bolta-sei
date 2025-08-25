<script>
  import { Tween } from 'svelte/motion'
  import { fade, fly } from 'svelte/transition'
  import { fromStore } from 'svelte/store'
  import { useProgress } from '@threlte/extras'
  
  const { progress: progressStore } = useProgress()
  const p = fromStore(progressStore)
  const tweenedProgress = Tween.of(() => p.current, {
    duration: 150
  })
  
  const progress = $derived(100 * tweenedProgress.current)
  const isLoading = $derived(tweenedProgress.current < 1)
  
  // Enhanced loading states for cyberpunk theme
  let loadingText = $state('LOADING NEURAL NETWORKS...')
  let glitchEffect = $state(false)
  
  $effect(() => {
    const currentProgress = tweenedProgress.current
    if (currentProgress < 0.2) {
      loadingText = 'INITIALIZING SYSTEM...'
    } else if (currentProgress < 0.4) {
      loadingText = 'LOADING NEURAL NETWORKS...'
    } else if (currentProgress < 0.6) {
      loadingText = 'CONNECTING TO BLOCKCHAIN...'
    } else if (currentProgress < 0.8) {
      loadingText = 'RENDERING CYBERPUNK WORLD...'
    } else if (currentProgress < 0.95) {
      loadingText = 'SYNCHRONIZING REALITY...'
    } else {
      loadingText = 'SYSTEM READY'
    }
    
    // Glitch effect at certain progress points
    if (currentProgress > 0.3 && currentProgress < 0.35) {
      glitchEffect = true
      setTimeout(() => glitchEffect = false, 200)
    }
  })
</script>

{#if isLoading}
  <div 
    transition:fade={{ duration: 500 }}
    class="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-gray-900 to-black overflow-hidden flex items-center justify-center"
  >
    <!-- Static Japanese Characters Background -->
    <div class="absolute inset-0 opacity-15">
      {#each Array(30) as _, i}
        <div 
          class="absolute text-green-400/40 text-xs font-mono select-none animate-pulse"
          style="top: {Math.random() * 90}%; left: {Math.random() * 95}%; transform: rotate({Math.random() * 360}deg); animation-delay: {Math.random() * 3}s; animation-duration: {2 + Math.random() * 2}s"
        >
          {Array(6).fill(0).map(() => String.fromCharCode(0x30A0 + Math.random() * 96)).join('')}
        </div>
      {/each}
    </div>
    
    <!-- Subtle Fade Background -->
    <div class="absolute inset-0 opacity-10">
      {#each Array(6) as _, i}
        <div 
          class="absolute w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"
          style="top: {Math.random() * 80}%; left: {Math.random() * 80}%; animation-delay: {i * 0.5}s; animation-duration: {4 + Math.random() * 2}s"
        ></div>
      {/each}
    </div>
    
    <!-- Animated Grid Background -->
    <div class="absolute inset-0 opacity-10">
      <div class="w-full h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" style="background-size: 50px 50px; background-image: linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)"></div>
    </div>
    
    <!-- Floating Particles -->
    <div class="absolute inset-0">
      {#each Array(15) as _, i}
        <div 
          class="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
          style="top: {Math.random() * 100}%; left: {Math.random() * 100}%; animation-delay: {i * 0.2}s; animation-duration: {2 + Math.random() * 3}s"
        ></div>
      {/each}
    </div>
    
    <!-- Main Content -->
    <div class="z-10 text-center max-w-4xl px-12 py-8">
      <!-- Project Title with Enhanced Effects -->
      <div class="mb-12 w-full">
        <h1 
          class="text-5xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-500 
                 {glitchEffect ? 'animate-bounce' : 'animate-pulse'} 
                 drop-shadow-2xl filter text-center"
          style="text-shadow: 0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(147, 51, 234, 0.3); word-spacing: 0.1em;"
        >
          BOLTA.WORLD
        </h1>
        <div class="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
      </div>
      
      <!-- Loading Text with Typewriter Effect -->
      <div class="mb-12 h-8">
        <p 
          class="text-cyan-300 text-2xl font-mono tracking-widest {glitchEffect ? 'animate-bounce text-red-400' : 'animate-pulse'}"
          style="text-shadow: 0 0 20px rgba(6, 182, 212, 0.8)"
          transition:fly={{ y: 20, duration: 300 }}
        >
          {loadingText}
        </p>
      </div>
      
      <!-- Enhanced Progress Bar -->
      <div class="relative w-full max-w-lg mx-auto mb-8">
        <div class="h-6 bg-gray-800/50 rounded-full border border-cyan-400/30 overflow-hidden backdrop-blur-sm">
          <div
            class="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-300 ease-out relative overflow-hidden"
            style="width: {progress}%; box-shadow: 0 0 20px rgba(6, 182, 212, 0.6)"
          >
            <!-- Animated Shine Effect -->
            <div 
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
              style="animation-duration: 2s"
            ></div>
            
            <!-- Moving Light Beam -->
            <div 
              class="absolute top-0 right-0 w-8 h-full bg-gradient-to-r from-transparent to-white/50 animate-pulse"
              style="box-shadow: 0 0 20px rgba(255, 255, 255, 0.8)"
            ></div>
          </div>
          
          <!-- Scanning Lines -->
          <div class="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-pulse"></div>
        </div>
      </div>
      
      <!-- Progress Percentage with Enhanced Styling -->
      <div class="mb-8">
        <span 
          class="text-4xl font-mono font-bold text-cyan-300 {glitchEffect ? 'animate-bounce' : 'animate-pulse'}"
          style="text-shadow: 0 0 20px rgba(6, 182, 212, 0.8)"
        >
          {Math.round(progress)}%
        </span>
      </div>
      
      <!-- Enhanced Cyberpunk Decorative Elements -->
      <div class="absolute -top-40 -left-40 w-64 h-64 border-2 border-cyan-400/20 rotate-45 animate-spin" style="animation-duration: 30s"></div>
      <div class="absolute -top-32 -left-32 w-48 h-48 border border-purple-400/30 rotate-45 animate-spin" style="animation-duration: 25s; animation-direction: reverse"></div>
      
      <div class="absolute -bottom-40 -right-40 w-56 h-56 border-2 border-pink-400/20 rotate-45 animate-spin" style="animation-duration: 35s; animation-direction: reverse"></div>
      <div class="absolute -bottom-32 -right-32 w-40 h-40 border border-cyan-400/30 rotate-45 animate-spin" style="animation-duration: 20s"></div>
      
      <!-- Corner Brackets -->
      <div class="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-cyan-400/40 animate-pulse"></div>
      <div class="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-cyan-400/40 animate-pulse"></div>
      <div class="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-cyan-400/40 animate-pulse"></div>
      <div class="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-cyan-400/40 animate-pulse"></div>
    </div>
  </div>
{/if}

<style>
  @keyframes matrix-rain {
    0% { transform: translateY(-100vh); }
    100% { transform: translateY(100vh); }
  }
  
  .matrix-rain {
    animation: matrix-rain linear infinite;
  }
</style>