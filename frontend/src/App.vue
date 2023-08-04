<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
import { useLoginStore } from './stores/login';
import { ref } from 'vue';

const login = ref(useLoginStore());
</script>

<template>
  <NavBar v-if="login.logged"/>
  <RouterView />
</template>

<style scoped>

</style>
