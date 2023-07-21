<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
<div>
  <h1>Home</h1>
  <RouterLink :to="{ name: 'game' }"><button>Game</button></RouterLink>
</div>
</template>
