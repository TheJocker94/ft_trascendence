<template>
    <button onclick="my_modal_1.showModal()" type="button" class="text-black bg-[#e6e6e6] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 mr-2 mb-2">
    <img class="object-scale-down h-5 w-5 mr-2" src="src/assets/42logo.png">
    Sign in
  </button>
    <dialog id="my_modal_1" class="modal">
        <form  method="dialog" class="modal-box">
            <!-- <form @submit.prevent="login" class=" shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="Emails">
                  Email
                </label>
                <input v-model="credentials.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline" id="Emails" type="text" placeholder="Email" required
                autofocus>
              </div>
              <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="passwords">
                  Password
                </label>
                <input v-model="credentials.password" class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-white-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="passwords" type="password" placeholder="******************" required>
                <p class="text-red-500 text-xs italic">Please choose a password.</p>
              </div>
              <div class="flex items-center justify-between">
                <button @click="login" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" >
                  Sign In
                </button>
                <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                  Sei scemo?
                </a>
              </div>
            </form> -->
            <Form @submit="onSubmit" :validation-schema="schema" class=" shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Your Email</label>
              <Field v-model="credentials.email" class="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline" id="email_addr" name="email_addr" type="emailSig" />
              <ErrorMessage name="email_addr" />
          
              <label class="block text-gray-700 text-sm font-bold mb-2" for="password_signin">Your Password</label>
              <Field v-model="credentials.password" class="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline" id="password_signin" name="acc_pazzword" type="password" />
              <ErrorMessage name="acc_pazzword" />
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
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

// Router, authStore, credentials
const router = useRouter();
const auth = ref(useAuthStore());
const credentials = reactive({
  email:"",
  password:""
})

//Validation schema
const schema = yup.object().shape({
  email_addr: yup.string().email().required().label('Email Address'),
  acc_pazzword: yup.string().min(5).required().label('Your Password'),
});
//submit function
// const login = async () => {
//   const e = await auth.value.signInLocal(credentials.email, credentials.password);
//   if (e)
//   {
//     console.log("danger", "failure", e.message);
//     return;
//   }
//   else
// 		router.push('/');
// };
async function onSubmit() {
  console.log("Sommettiti")
  console.log("email", credentials.email)
  console.log("pass", credentials.password)
  const e = await auth.value.signInLocal(credentials.email, credentials.password);
  if (e)
  {
    console.log("danger", "failure", e.message);
    return;
  }
  else
		router.push('/');
  // alert(JSON.stringify(values, null, 2));
}
// const Current_User = reactive(useCurrentUserStore());
// const SendCredential = () => {
//     axios.post('http://localhost:3000/auth/local/signin', { email:credentials.email, password:credentials.password })
//   .then(response => {
//     console.log(response.data);
//     Current_User.accessToken = response.data.accessToken;
//     Current_User.refreshToken = response.data.refreshToken;
//     localStorage.setItem("accessToken", response.data.accessToken);
//     localStorage.setItem("refreshToken", response.data.refreshToken);
//     console.log("Access token is ", Current_User.accessToken);
//     console.log("Refresh token  is ", Current_User.refreshToken);
//   })
//   .catch(error => {
//     console.error(error);
//   });


// }
</script>
