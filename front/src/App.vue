<template>
  <div
    class="flex flex-col min-h-screen font-Roboto bg-[url('pong_login.webp')] bg-cover bg-center"
  >
    <SiteNavigation />
    <router-view />
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import SiteNavigation from "./components/SiteNavigation.vue";
import FooterSection from "./components/FooterSection.vue";
</script>
