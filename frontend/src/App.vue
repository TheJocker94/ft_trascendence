<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
// import { useLoginStore } from './stores/login';
import { useAuthStore } from './stores/auth';
import { useCurrentUserStore } from './stores/currentUser';
import { ref, onBeforeMount } from 'vue';
const authStore = ref(useAuthStore());
const userStore = ref(useCurrentUserStore());
onBeforeMount( async () => {
  if (userStore.value.userId)
    await userStore.value.initStore(null, null);
});
</script>

<template>
  <!-- <div class="page-container">
    <div class="content"> -->
      <!-- <div class="bg-cover bg-center bg-no-repeat h-screen" :style="`background-image: url(${imageUrl})`"> -->
        <NavBar v-if="authStore.isLoggedIn"/>
        <RouterView />
      <!-- </div> -->
    <!-- </div>
    <FooterBar v-if="authStore.isLoggedIn"/>
  </div> -->
</template>

<!-- <style scoped>
.page-container {
  display: grid;
  grid-template-rows: 1fr auto; /* Make the content area take up remaining space, and the footer area auto-sized */
  min-height: 100vh;
}

.content {
  display: flex;
  flex-direction: column;
}

.router-view {
  flex-grow: 1;
}
</style> -->
