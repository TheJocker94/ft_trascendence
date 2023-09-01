<template>
  <div class="hero min-h-screen" :style="`background-image: url(${('src/assets/auth.jpg')})`">
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content text-center text-neutral-content">
      <div class="max-w-md">
        <h1 class="mb-5 text-4xl font-bold">How About a Pong Game Neo</h1>
        <p class="mb-5">Login for the matrix</p>      
        
        <div class="flex justify-center mb-2">
          <button @click="loginFortyTwo()" type="button" class="text-black bg-[#e6e6e6] hover:bg-[#f2f2f2]/90 focus:ring-4 focus:outline-none focus:ring-[#f2f2f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#f2f2f2]/50 dark:hover:bg-[#f2f2f2]/30">
            <img class="object-scale-down h-5 w-5 mr-2" src="src/assets/42logo.png">
            Sign in with Intra 42
          </button>
        </div>
        
        <div class="flex justify-center space-x-4">
          <SignupModal/>
          <SigninModal/>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
declare global {
  interface Window {
    accessToken: string;
	refreshToken: string;
  }
}
import { ref } from 'vue';
// import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { openSignInWindow } from './OauthPopup';
import SignupModal from '@/components/auth/SignupModal.vue';
import SigninModal from '@/components/auth/SigninModal.vue';

const authStore = ref(useAuthStore());
// const router = useRouter();
// let signInWindow: Window | null = null;

window.addEventListener('message', receiveMessageFortyTwo);

async function receiveMessageFortyTwo  (event?: MessageEvent<any>){
  const { accessToken, refreshToken } = event!.data;
  window.accessToken = accessToken;
  window.refreshToken = refreshToken;
  // console.log("access:", window.accessToken);
  // console.log("refresh:", window.refreshToken);
  authStore.value.signInFortyTwo(window.accessToken, window.refreshToken);
  // router.push('/');
  // location.reload();

}


async function loginFortyTwo() {
	openSignInWindow('/api/auth/42/signin');
}

</script>

<style scoped>

</style>
