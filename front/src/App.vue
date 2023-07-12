<template>
  <div
    class="flex flex-col min-h-screen font-Roboto bg-[url('pong_login.webp')] bg-cover bg-center"
  >
    <SiteNavigation v-if="login" />
    <div
      class="transition-transform duration-500 transform-gpu w-full h-full flex my-auto"
      :class="{
        '-translate-x-full': !showButton,
        'translate-x-0': showButton,
      }"
    >
      <button
        v-if="!login"
        @click="login = !login"
        class="bg-secondary hover:bg-primary text-white font-bold py-2 px-4 rounded mx-auto my-auto"
        ref="button"
      >
        Log in
        <img
          src="./assets/logo42.png"
          alt="logo 42"
          class="h-6 w-6 inline-block"
        />
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
import { onMounted, ref } from "vue";

const login = ref(false);
const showButton = ref(false);
onMounted(() => {
  setTimeout(() => {
    showButton.value = true;
  }, 500);
});
</script>
