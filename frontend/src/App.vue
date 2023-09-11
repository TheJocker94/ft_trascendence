<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
import { useGameStore } from './stores/gameInvite';
import { useAuthStore } from './stores/auth';
import { useCurrentUserStore } from './stores/currentUser';
import { ref, onBeforeMount, onMounted} from 'vue';
import AuthService from './services/AuthService';
import { useFriendStore } from './stores/friend';

const gameStore = ref(useGameStore());
const authStore = ref(useAuthStore());
const userStore = ref(useCurrentUserStore());
const friendStore = ref(useFriendStore());

onBeforeMount( async () => {
  if (userStore.value.userId)
    await userStore.value.initStore(null, null);
});

onMounted(async () => {
  window.addEventListener("beforeunload", unload);
  AuthService.online();
  setInterval(async () => {
    if (userStore.value.userId){
      await gameStore.value.initStore(userStore.value.userId)
      await friendStore.value.initStore(userStore.value.userId)
    }
  }, 3000);
});

function unload() {
  console.log("unload");
  AuthService.offline();
}




</script>

<template>
	<NavBar v-if="authStore.isLoggedIn"/>
	<RouterView />
</template>
