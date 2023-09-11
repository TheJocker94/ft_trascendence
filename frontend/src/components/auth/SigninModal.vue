<template>
    <button onclick="my_modal_1.showModal()" type="button" class="text-black bg-[#e6e6e6] hover:bg-[#f2f2f2]/90 focus:ring-4 focus:outline-none focus:ring-[#f2f2f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#f2f2f2]/50 dark:hover:bg-[#f2f2f2]/30 mr-2 mb-2">
    <img class="object-scale-down h-5 w-5 mr-2" src="src/assets/logo.svg">
    Sign in
  </button>
    <dialog id="my_modal_1" class="modal">
        <form  method="dialog" class="modal-box"  >
            <Form @submit="onSubmit" :validation-schema="schema" class=" shadow-md rounded px-8 pt-6 pb-8 mb-4 " v-if="!twofa">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Your Email or Username</label>
              <Field v-model="credentials.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline" id="email_addr" name="email_addr" type="emailSig" />
              <ErrorMessage name="email_addr" class="text-red-500"/>
          
              <label class="block text-gray-700 text-sm font-bold mb-2" for="password_signin">Your Password</label>
              <Field v-model="credentials.password" class="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline" id="password_signin" name="acc_pazzword" type="password" />
              <ErrorMessage name="acc_pazzword" class="text-red-500" />
              <div class="flex items-center justify-between">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" >
                  Sign In
                </button>
                <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                  Sei scemo?
                </a>
              </div>
              <!-- <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button> -->
            </Form>
            <Form v-else @submit="onSubmit2fa" :validation-schema="schema2fa" class=" shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
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
        </form>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
        <!-- Da aggiungere alert Popup -->
      <!--  <div class="alert alert-error">
  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  <span>Error! Task failed successfully.</span>
</div> -->
      </dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import type { IError } from '@/models/IError';

// Router, authStore, credentials
const auth = ref(useAuthStore());
const twofa = ref(false);
const isEmail = ref(false);
const credentials = reactive({
  email:"",
  password:"",
  username:"",
  twofaCode:""
})

//Validation schema
const schema = yup.object().shape({
  email_addr: yup.string().required().label('Email Address/Username'),
  acc_pazzword: yup.string().min(5).required().label('Your Password'),
});

const schema2fa = yup.object().shape({
  code: yup.string().required().label('2FA Code'),
});

function isError(obj: any): obj is IError {
  return obj && typeof obj.message === 'string' && typeof obj.statusCode === 'number';
}

async function onSubmit2fa() {
    const e = await auth.value.signInLocal2fa(credentials.twofaCode, credentials.email, isEmail.value);
    credentials.twofaCode = "";
    if (isError(e)) {
      alert(e.message);
      return;
	}
}

async function onSubmit()
{
	let email: string | null = credentials.email;
  
	if (!email.includes('@')) {
    isEmail.value = false;
	}
  else {
    isEmail.value = true;
  }
  try{

    const e = await auth.value.signInLocal(email, credentials.password, isEmail.value);
    if (typeof e === 'boolean'){
      if (e === true)
        twofa.value = true;
      return;
    }
    if (isError(e)) {
      alert('INVALID CREDENTIALS');
      return;
    }
  }
  catch(e){
    alert('INVALID CREDENTIALS');
  }
}

</script>
