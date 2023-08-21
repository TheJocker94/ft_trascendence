<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import type { Game } from 'phaser'

let gameInstance: Game | null = null
const containerId = 'game-container'
const game = await import('@/game/game')


onMounted(async () => {
  gameInstance = game.launch(containerId)
})

onUnmounted(() => {
  gameInstance?.destroy(false)
})
</script>

<template>
  <!-- <div :id="containerId" /> -->
  <div class="container is-fullheight">
    <div class="columns is-centered is-vcentered is-fullheight">
      <div class="column is-narrow" :id="containerId"></div>
    </div>
  </div>

</template>

<style scoped>
canvas {
  display: block;
}

.container {
  outline: thin dotted aqua;
}

.row, .col, [class*="col-"] {
  outline: thin dotted violet;
}

/* REMOVED */
#fullscreenTarget {
  position: absolute;
  left: 0;
  top: 0;
  outline: thin dotted lime;
}

#phaser3MainView {
  outline: thin dotted yellow;
}
</style>