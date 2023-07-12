<template>
  <div
    class="flex flex-col min-h-screen font-Roboto bg-[url('pong_login.webp')] bg-cover bg-center"
  >
    <SiteNavigation v-if="login" />
    <div class="mx-auto my-auto">
      <button
        v-if="!login"
        @click="login = !login"
        class="bg-secondary hover:bg-primary text-white font-bold py-2 px-4 rounded"
      >
        Log in
        <img src="./assets/logo42.png" alt="logo 42" class="h-6" />
      </button>
    </div>
    <FooterSection v-if="login" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import SiteNavigation from "./components/SiteNavigation.vue";
import FooterSection from "./components/FooterSection.vue";
import { ref } from "vue";

const login = ref(false);
</script>
