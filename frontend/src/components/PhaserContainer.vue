<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { Game } from 'phaser'

let gameInstance: Game | null = null
const containerId = 'game-container'
const game = await import('@/game/game')

onMounted(async () => {
  gameInstance = game.launch(containerId);
  
  // Add the resize event listener with a check for gameInstance being non-null
  window.addEventListener('resize', () => {
    if (gameInstance) {
      game.resizeGame(gameInstance);
    }
  });
})

onUnmounted(() => {
  gameInstance?.destroy(false);
  
  // Remove the resize event listener
  window.removeEventListener('resize', () => {
    if (gameInstance) {
      game.resizeGame(gameInstance);
    }
  });
})
</script>

<template>
  <div class="game-container" :id="containerId"></div>
</template>

<style scoped>
.game-container canvas {
  display: block;
  max-width: 100%;
  max-height: 100%;
  margin: 0 auto;
}
</style>
