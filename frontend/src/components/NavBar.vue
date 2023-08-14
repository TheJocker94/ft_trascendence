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
              <img :src=userStore.avatar />
            </div>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><router-link
              :to="{
                name: 'profile',
                params: { userid: userStore.userId },
              }"
              class="dropdown-item"
              >{{userStore.username}}</router-link
            ></li>
            
            <li>
              <div onclick="my_modal_5.showModal()">Notifications</div>
              <div class="modal-container">
                <dialog id="my_modal_5" class="custom-modal modal-box bg-red-800">
                  <!-- <form method="dialog" class="modal-box bg-red-800"> -->
                  <h3 class="font-bold text-lg">Hello!</h3>
                  <p class="py-4">Press ESC key or click the button below to close</p>
                  <!-- </form> -->
                  <div class="modal-action">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn" onclick="my_modal_5.close()">Close</button>
                  </div>
                </dialog>
              </div>
            </li>
            <li><a @click="logout()">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import axios from 'axios';
// import { useCurrentUserStore } from '@/stores/Current_User';
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth';
import { useCurrentUserStore } from '@/stores/currentUser';
import { useRouter } from 'vue-router';

const auth = ref(useAuthStore());
const router = useRouter();
const userStore = ref(useCurrentUserStore());
console.log("UserStore",userStore.value.username);
const logout = () => {
  auth.value.logout();
  router.push({ name: 'home' });
};
</script>

<!-- <style scoped>
#my_modal_5 {
  /* Center the modal relative to the viewport */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  /* Adjust the size */
  width: 70%;  /* Adjust this value as per your requirement */
  max-width: 600px;  /* Adjust this value as per your requirement */
  
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 2000; /* Ensure it's on top */
}
</style> -->