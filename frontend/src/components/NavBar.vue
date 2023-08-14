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
				<div @click="openModal" >Notifications</div>
            </li>
            <li><a @click="logout()">Logout</a></li>
          </ul>
        </div>
      </div>
	  <div v-if="isModalOpen" class="modal-container" @click="closeModal">
					<dialog @click.stop class="custom-modal modal-box bg-black-100 w-3/5 h-1/2 flex flex-col justify-between">
						<div class="flex justify-between mb-4">
							<button class="btn text-yellow-600 py-1 px-4 border-2 border-white-500 hover:bg-white-500 hover:cursor-pointer hover:text-white rounded-3xl mx-2">Friend Request</button>
							<button class="btn text-yellow-600 py-1 px-4 border-2 border-white-500 hover:bg-white-500 hover:cursor-pointer hover:text-white rounded-3xl mx-2">Join Channel</button>
							<button class="btn text-yellow-600 py-1 px-4 border-2 border-white-500 hover:bg-white-500 hover:cursor-pointer hover:text-white rounded-3xl mx-2">Join Game</button>
						</div>
						<p class="py-4">Press ESC key or click the button below to close</p>
						<div class="modal-action self-end">
							<!-- if there is a button in form, it will close the modal -->
							<button v-if="isModalOpen" @click="closeModal" class="btn">Close</button>
						</div>
					</dialog>
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

const isModalOpen = ref(false);

const openModal = () => {
	isModalOpen.value = true;
};

const closeModal = () => {
	isModalOpen.value = false;
};

const auth = ref(useAuthStore());
const router = useRouter();
const userStore = ref(useCurrentUserStore());
console.log("UserStore",userStore.value.username);
const logout = () => {
  auth.value.logout();
  router.push({ name: 'home' });
};
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  margin: 0; /* Reset margin */
  padding: 0; /* Reset padding */
  box-sizing: border-box; /* Ensure padding and borders are included in the total width and height */
}

.custom-modal {
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  margin: 0; /* Reset margin */
  padding: 0; /* Reset padding */
  box-sizing: border-box; /* Ensure padding and borders are included in the total width and height */
  width: 60%; /* Set a specific width; adjust as needed */
}
</style>