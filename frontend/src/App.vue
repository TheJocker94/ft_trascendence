<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
// import { useLoginStore } from './stores/login';
import { useAuthStore } from './stores/auth';
import { useCurrentUserStore } from './stores/currentUser';
import { ref, onBeforeMount } from 'vue';
import imageUrl from '@/assets/auth.jpg'; 
const authStore = ref(useAuthStore());
const userStore = ref(useCurrentUserStore());
onBeforeMount( async () => {
  if (userStore.value.userId)
    await userStore.value.initStore(null, null);
});
</script>

<template>
  <div class="bg-cover bg-center bg-no-repeat h-screen" :style="`background-image: url(${imageUrl})`">
    <NavBar v-if="authStore.isLoggedIn"/>
    <RouterView />

  </div>
</template>

<style scoped>

</style>
