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
  <NavBar v-if="authStore.isLoggedIn"/>
  <RouterView />
</template>

<style scoped>

</style>
