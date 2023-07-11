<template>
  <header class="sticky top-0 bg-secondary shadow-lg">
    <nav
      class="container flex flex-col sm:flex-row items-center gap-4 text-white py-4"
    >
      <RouterLink :to="{ name: 'home' }">
        <div class="flex items-center gap-3 flex-1">
          <img src="@/assets/ponghino.png" class="h-10" alt="logo" />
        </div>
      </RouterLink>
      <div class="flex gap-3 flex-1 justify-end">
        <i
          class="fa-solid fa-right-to-bracket text-xl text-yellow-400 hover:text-red-500 duration-150 cursor-pointer"
        ></i>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
