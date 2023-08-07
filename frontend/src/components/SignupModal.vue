<template>
    <button type="button" onclick="my_modal_2.showModal()" class="text-black bg-[#e6e6e6] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 mr-2 mb-2">
        <img class="object-scale-down h-5 w-5 mr-2" src="src/assets/42logo.png">
        Sign up
      </button>
    <dialog id="my_modal_2" class="modal">
        <form method="dialog" class="modal-box">
          <!-- <h3 class="font-bold text-lg">Hello!</h3>
          <p class="py-4">Press ESC key or click outside to close</p> -->
          <div class="w-full max-w-xs">
            <form class=" shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="Email">
                  Email
                </label>
                <input v-model="emailSignup" class="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline" id="Email" type="text" placeholder="Email" >
              </div>
              <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                  Password
                </label>
                <input v-model="passSignup" class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-white-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" >
                <p class="text-red-500 text-xs italic">Please choose a password.</p>
              </div>
              <div class="flex items-center justify-between">
                <button @click="SendCredential()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                  Sign Up
                </button>
                <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                  Sei stronzo?
                </a>
              </div>
            </form>
            <p class="text-center text-gray-500 text-xs">
              &copy;2023 Mario Rispondi All rights reserved.
            </p>
          </div>
        </form>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios';
import { useCurrentUserStore } from '@/stores/Current_User';

const emailSignup = ref('');
const passSignup = ref('');
const Current_User = ref(useCurrentUserStore());
const SendCredential = () => {
    axios.post('http://localhost:3000/auth/local/signup', { email:emailSignup.value, password:passSignup.value })
  .then(response => {
    console.log(response.data);
    Current_User.value.accessToken = response.data.accessToken;
    Current_User.value.refreshToken = response.data.refreshToken;
    console.log("Access token is ", Current_User.value.accessToken);
    console.log("Refresh token  is ", Current_User.value.refreshToken);
  })
  .catch(error => {
    console.error(error);
  });


}
</script>
