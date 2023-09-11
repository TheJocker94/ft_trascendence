<template>
    <button type="button" onclick="my_modal_2.showModal()" class="text-black bg-[#e6e6e6] hover:bg-[#f2f2f2]/90 focus:ring-4 focus:outline-none focus:ring-[#f2f2f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#f2f2f2]/50 dark:hover:bg-[#f2f2f2]/30 mr-2 mb-2">
        <img class="object-scale-down h-5 w-5 mr-2" src="src/assets/logo.svg">
        Sign up
      </button>
    <dialog id="my_modal_2" class="modal">
        <form method="dialog" class="modal-box">
          <Form @submit="onSubmit" :validation-schema="schema" class=" shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Your Email</label>
            <Field v-model="credentials.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline" id="email_addr_signup" name="email_addr" type="emailSig" />
            <ErrorMessage name="email_addr_signup" />
        
            <label class="block text-gray-700 text-sm font-bold mb-2" for="username_signup">Your Username</label>
            <Field v-model="credentials.username" class="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline" id="username_signup" name="username" type="username" />
            <ErrorMessage name="username_signup" />

            <label class="block text-gray-700 text-sm font-bold mb-2" for="password_signin">Your Password</label>
            <Field v-model="credentials.password" class="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline" id="password_signup" name="acc_pazzword" type="password" />
            <ErrorMessage name="acc_pazzword" />
            <div class="flex items-center justify-between">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" @click="onSubmit" >
                Sign up
              </button>
              <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                Sei stronzo?
              </a>
            </div>
            <!-- <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button> -->
          </Form>
            <p class="text-center text-gray-500 text-xs">
              &copy;2023 Mario Rispondi All rights reserved.
            </p>
        </form>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

// Router, authStore, credentials
const auth = ref(useAuthStore())
const credentials = reactive({
  email:"",
  password:"",
  username:""
})

//Validation schema
const schema = yup.object().shape({
  email_addr: yup.string().email().required().label('Email Address'),
  acc_pazzword: yup.string().min(5).required().label('Your Password'),
  username: yup.string().min(5).required().label('Your Username'),
});

// Submit function
async function onSubmit() {
  const e = await auth.value.signUpLocal(credentials.email, credentials.username, credentials.password);
  if (e)
  {
    // alert(e.message)
    return;
  }
}

</script>
