<template>
	<div class="hero min-h-screen" style="background-image: url(https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg);">
    <div class="hero-overlay bg-opacity-60"></div>
      <div class="hero-content text-center text-neutral-content">
        <div class="max-w-md">
          <h1 class="mb-5 text-4xl font-bold">How About a Pong Game Neo</h1>
          <p class="mb-5">Login for the matrix</p>      
          <button @click="signin.login()" type="button" class="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2">
            <svg class="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
              <path fill-rule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clip-rule="evenodd"/>
            </svg>
            Sign in with Google
          </button>
          <button @click="signin.login()" type="button" class="text-black bg-[#e6e6e6] hover:bg-[#f2f2f2]/90 focus:ring-4 focus:outline-none focus:ring-[#f2f2f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#f2f2f2]/50 dark:hover:bg-[#f2f2f2]/30 mr-2 mb-2">
            <img class="object-scale-down h-5 w-5 mr-2" src="src/assets/42logo.png">
            Sign in with Intra 42
          </button>
          <SignupModal/>
          <SigninModal/>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLoginStore } from '@/stores/login';
import SignupModal from '@/components/auth/SignupModal.vue';
import SigninModal from '@/components/auth/SigninModal.vue';

const signin = ref(useLoginStore());
</script>

<style scoped>

</style>