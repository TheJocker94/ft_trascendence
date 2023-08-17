<template>
  <div class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-1 z-[1] p-2 shadow bg-base-100 rounded-box w-52 ">
          <li>
            <RouterLink
              to="/friends"
              
            >

              <a>Chat</a>
            </RouterLink>
          </li>
          <li>
                <RouterLink
                to="/game"
                
                >
                Game
                </RouterLink>
          </li>
          <li><a  href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Hot girl near you</a></li>
        </ul>
      </div>
      <RouterLink
            to="/"
            class="btn btn-ghost normal-case text-xl"
            
          >
            Pong
          </RouterLink>
    </div>
    <div class="navbar-center hidden lg:flex">
      <!-- <div class="dropdown "> -->
        <ul class="menu menu-horizontal dropdown-content px-1">
          <li tabindex="0" class="z-10">
            <RouterLink
              to="/friends"
            >
              <summary >Chat</summary>
            </RouterLink>
          </li>
          <li tabindex="0" class="z-10">
            <RouterLink
                  to="/game"
                >
                  Pong
                </RouterLink>
          </li>
          <li><a  href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Hot girl near you</a></li>
        </ul>
      <!-- </div> -->
      
    </div>
    <div class="navbar-end">
      <div class="flex-none">
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img :src=userStore.avatar />
            </div>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-1 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
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
							<button  @click="showFriendRequest = true, showChannelInvite = false, showGameRequest = false" class="btn text-yellow-600 py-1 px-4 border-2 border-white-500 hover:bg-white-500 hover:cursor-pointer hover:text-white rounded-3xl mx-2">Friend Request</button>
							<button  @click="showChannelInvite = true, showFriendRequest = false, showGameRequest = false" class="btn text-yellow-600 py-1 px-4 border-2 border-white-500 hover:bg-white-500 hover:cursor-pointer hover:text-white rounded-3xl mx-2">Join Channel</button>
							<button  @click="showGameRequest = true, showFriendRequest = false, showChannelInvite = false" class="btn text-yellow-600 py-1 px-4 border-2 border-white-500 hover:bg-white-500 hover:cursor-pointer hover:text-white rounded-3xl mx-2">Join Game</button>
						</div>
						<div v-if="showFriendRequest">
							<ul>
								<li v-for="friend in friendStore.pending" :key="friend.id">
									<router-link
									:to="{
										name: 'profile',
										params: { userid: friend.id },
									}"
									@click="closeModal"
									class="btn btn-ghost btn-circle avatar">
										<div class="w-6 rounded-full">
												<img :src=friend.profilePicture />
										</div>
									</router-link>
									{{ friend.username }}
									
									<!-- Accept button -->
									<button @click="acceptRequest(friend.id)"> <i class="fa-solid fa-circle-check" style="color: #21b02b;"></i> </button>
									
									<!-- Reject button -->
									<button @click="declineRequest(friend.id)"><i class="fa-solid fa-circle-xmark" style="color: #d41616;"></i></button>
								</li>
							</ul>
						</div>
						<div v-if="showChannelInvite">
							<p>balh balhadifj ioawjekvds</p>
						</div>
						<div v-if="showGameRequest">
							<p>what you said ah what yes</p>
						</div>
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
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { useFriendStore } from '@/stores/friend';
import FriendService from '@/services/FriendService';
import axios, { AxiosError } from 'axios';
import type { IError } from '@/models/IError';

onBeforeRouteLeave(() => {
  closeAllDropdowns();
  return true; // Allow the route change to proceed
});
const friendStore = ref(useFriendStore());

const showFriendRequest = ref(true);
const showChannelInvite = ref(false);
const showGameRequest = ref(false);
const userStore = ref(useCurrentUserStore());

const closeAllDropdowns = () => {
  // Close all dropdowns
  const dropdowns = document.querySelectorAll('.dropdown-content');
  dropdowns.forEach(dropdown => {
    dropdown.classList.remove('open'); // Assuming 'open' class makes the dropdown visible
  });
};


async function acceptRequest(userId: string) {
	try {
		await FriendService.acceptFriendship(userId);
		friendStore.value.updatePendings(userStore.value.userId);
		friendStore.value.updateFriends(userStore.value.userId);
	} catch (err) {
		const e = err as AxiosError<IError>;
		if (axios.isAxiosError(e)) return e.response?.data;
	}
}

async function declineRequest(userId: string) {
	try {
		await FriendService.endFriendship(userId);
		friendStore.value.updatePendings(userStore.value.userId);
		friendStore.value.updateFriends(userStore.value.userId);
	} catch (err) {
		const e = err as AxiosError<IError>;
		if (axios.isAxiosError(e)) return e.response?.data;
	}
}

const isModalOpen = ref(false);

const openModal = () => {
	isModalOpen.value = true;
};

const closeModal = () => {
	isModalOpen.value = false;
};

const auth = ref(useAuthStore());
const router = useRouter();
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
  padding: 20px; /* Reset padding */
  box-sizing: border-box; /* Ensure padding and borders are included in the total width and height */
  width: 60%; /* Set a specific width; adjust as needed */
}
</style>