<script setup lang="ts">
import GamePong from '@/components/GamePong.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div>
    <RouterLink to="/"><button>Home</button></RouterLink>
  </div>
  <GamePong />
  <div class="attribution-block"><a href="https://dig.ccmixter.org/files/AntSurvila/66102">RUN</a> by Ant.Survila (c) copyright 2023 Licensed under a Creative Commons <a href="http://creativecommons.org/licenses/by-nc/3.0/">Attribution Noncommercial  (3.0)</a> license. Ft: Sparky</div>
</template>

<style>
</style>