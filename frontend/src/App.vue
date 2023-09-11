<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
import { useGameStore } from './stores/gameInvite';
import { useAuthStore } from './stores/auth';
import { useCurrentUserStore } from './stores/currentUser';
import { ref, onBeforeMount, onMounted} from 'vue';
import AuthService from './services/AuthService';

const gameStore = ref(useGameStore());
const authStore = ref(useAuthStore());
const userStore = ref(useCurrentUserStore());

onBeforeMount( async () => {
  if (userStore.value.userId)
    await userStore.value.initStore(null, null);
});

onMounted(async () => {
  window.addEventListener("beforeunload", unload);
  AuthService.online();
  setInterval(async () => {
    if (userStore.value.userId)
      await gameStore.value.initStore(userStore.value.userId)
    console.log("init game store app");
    console.log("Acceptd are ",gameStore.value.getAcceptef)
    console.log("Waiting are ",gameStore.value.getWaiting)
    console.log('Thinking are ',gameStore.value.getThinking)

  }, 10000);
});
// Function to set offline the user
function unload() {
  console.log("unload");
  AuthService.offline();
}




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
