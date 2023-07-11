<template>
  <div class="flex flex-col min-h-screen font-Roboto bg-primary">
    <SiteNavigation />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import SiteNavigation from "./components/SiteNavigation.vue";
</script>
