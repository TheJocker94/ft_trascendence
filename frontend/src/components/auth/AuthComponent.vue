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
        <!-- <div v-if="showPopup"> Dio cane</div> -->
        <div>
          <button ref="myButton" class="btn hidden" onclick="my_modal_5.showModal()">open modal</button>
          <dialog id="my_modal_5" class="modal">
            <div class="modal-box">
              <Form @submit="onSubmit2fa" :validation-schema="schema2fa" class=" shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="emailCode">Your Email code</label>
              <Field v-model="credentials.twofaCode" class="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline" id="emailCode" name="code" type="emailCode" />
              <ErrorMessage name="code" class="text-red-500"/>
              <div class="flex items-center justify-between">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" >
                  Sign In
                </button>
                <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                  Sei scemo?
                </a>
              </div>
              </Form>
              <p class="text-center text-gray-500 text-xs">
               &copy;2023 Mario Rispondi All rights reserved.
              </p>
            </div>
            <form method="dialog" class="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
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
    accessToken?: string;
    refreshToken?: string;
    is2faEnabled: boolean;
    email?: string;
  }
}
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { openSignInWindow } from './OauthPopup';
import SignupModal from '@/components/auth/SignupModal.vue';
import SigninModal from '@/components/auth/SigninModal.vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import type { IError } from '@/models/IError';

const authStore = ref(useAuthStore());
const showPopup = ref(false);
const myButton = ref<HTMLButtonElement>();
const credentials = reactive({
  email:"",
  twofaCode:""
})

const schema2fa = yup.object({
  code: yup.string().required().min(6).max(6),
});

async function onSubmit2fa() {
    const e = await authStore.value.signInLocal2fa(credentials.twofaCode, credentials.email, true);
    credentials.twofaCode = "";
    if (isError(e)) {
      alert(e.message);
      return;
	}
}

function isError(obj: any): obj is IError {
  return obj && typeof obj.message === 'string' && typeof obj.statusCode === 'number';
}

window.addEventListener('message', receiveMessageFortyTwo);

async function receiveMessageFortyTwo  (event?: MessageEvent<any>){
  const { tokens, is2faEnabled, email} = event!.data;
  window.is2faEnabled = is2faEnabled;
  if (window.is2faEnabled){
    window.email = email;
    credentials.email = email;
    showPopup.value = true;
    myButton.value!.click();
  }
  else{
    authStore.value.signInFortyTwo(tokens.accessToken, tokens.refreshToken);
  }
}


async function loginFortyTwo() {
	openSignInWindow('/api/auth/42/signin');
}

</script>

<style scoped>

</style>
