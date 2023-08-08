<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
// import { useLoginStore } from './stores/login';
import { useAuthStore } from './stores/auth';
import { ref } from 'vue';

const authStore = ref(useAuthStore());
</script>

<template>
  <NavBar v-if="authStore.isLoggedIn"/>
  <RouterView />
</template>

<style scoped>

</style>
