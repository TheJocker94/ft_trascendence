<script setup lang="ts">
import GamePong from '@/components/GamePong.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div>
    <RouterLink to="/"><button>Home</button></RouterLink>
  </div>
  <GamePong />
</template>

<style>
</style>