<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 ">
          <li>
            <a>Chat</a>
            <ul class="p-2">
              <li>
                <RouterLink
                to="/friends"
                >
                Friends
                </RouterLink>
              </li>
              <li><a>Invite</a></li>
            </ul>
          </li>
          <li>
            <a>Game</a>
            <ul class="p-2">
              <li>
                <RouterLink
                to="/game"
                >
                Pong
                </RouterLink>
              </li>
              <li><a>Stats</a></li>
            </ul>
          </li>
          <li><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Hot girl near you</a></li>
        </ul>
      </div>
      <RouterLink
            to="/"
            class="btn btn-ghost normal-case text-xl"
            active-class="is-active"
          >
            Pong
          </RouterLink>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li tabindex="0" class="z-10">
          <details>
            <summary>Chat</summary>
            <ul class="p-2">
              <li><RouterLink
                to="/friends"
              >
                Friends
              </RouterLink></li>
              <li><a>Invite</a></li>
            </ul>
          </details>
        </li>
        <li tabindex="0" class="z-10">
          <details>
            <summary>Game</summary>
            <ul class="p-2">
              <li><RouterLink
                to="/game"
              >
                Pong
              </RouterLink></li>
              <li><a>Stats</a></li>
            </ul>
          </details>
        </li>
        <li><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Hot girl near you</a></li>
      </ul>
    </div>
    <div class="navbar-end">
      <div class="flex-none">
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img :src=avatar />
            </div>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>{{username}}</a></li>
            <li><a>Settings</a></li>
            <li><a>Nizz super mega ultra</a></li>
            <li><a @click="auth.logout()">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import axios from 'axios';
// import { useCurrentUserStore } from '@/stores/Current_User';
import { ref, onUpdated } from 'vue'
import { useAuthStore } from '@/stores/auth';
import { useCurrentUserStore } from '@/stores/currentUser';

const auth = ref(useAuthStore());
const userStore = ref(useCurrentUserStore());
console.log("UserStore",userStore.value.username);
const username = ref(userStore.value.username);
const avatar = ref(userStore.value.avatar);
console.log("Username",username.value);
console.log("Avatar",avatar.value);
onUpdated(() => {
  username.value = userStore.value.username;
  avatar.value = userStore.value.avatar;
  console.log("New Username",username.value);
  console.log("New Avatar",avatar.value);
});
// const Current_User = reactive(useCurrentUserStore());
// const logout = ()=> {
//   const token = 'Bearer ' + localStorage.getItem('accessToken'); // ottieni il token dalla localStorage
//   console.log(token);
  
//   axios.post('http://localhost:3000/auth/logout', {
//     headers: {
//       'Authorization': token
//     }
//   })
//     .then(response => {
//       localStorage.setItem("accessToken", "");
//       console.log(response.data);
//     })
//     .catch(error => {
//       console.error(error);
//     });
// }
</script>
