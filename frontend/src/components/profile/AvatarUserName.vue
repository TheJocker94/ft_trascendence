<template>
	<div>
		<div class="px-6 py-4">
		<div class="flex flex-col">
			<div class="flex items-center mx-auto">
			<div class="font-bold text-xl text-center text-white-800 hover:text-white-500 hover:cursor-pointer">
				{{ usernameDisplay }}
			</div>
			<div v-if="isOwnProfile" class="ml-4">
				<button @click="showUsernameChange" class="text-white-800 py-1 px-4 border-2 border-white-500 hover:bg-white-500 hover:cursor-pointer hover:text-white rounded-3xl">
				<i class="fa-regular fa-pen-to-square"></i>
				</button>
			</div>
			</div>
		</div>
		<div v-if="isOwnProfile" class="flex justify-center mt-2">
			<div v-if="isChangingUsername">
			<input v-model="newUsername" placeholder="Enter new username" @keydown.enter="updateName" />
			<button @click="updateName" class="my-auto text-white-800 py-1 px-4 border-2 border-white-500 hover:bg-white-500 hover:cursor-pointer hover:text-white rounded-3xl mx-2">
				Update
			</button>
			<p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
			</div>
		</div>
		<div v-else class="flex flex-row justify-center font-semibold mx-auto my-4">
			<!-- Follow if not friends/Unfollow else -->
			<div v-if="friendsButton" @click="friendRequest()" class="my-auto text-white-800 bg-gray-500 hover:bg-gray-600 hover:cursor-pointer hover:text-white rounded-3xl py-2 px-4 mx-2">Add Friend</div>
			<div @click="friendremove()" class="my-auto text-white-800 bg-red-500 hover:bg-red-600 hover:cursor-pointer hover:text-white rounded-3xl py-2 px-4 mx-2">Block</div>
			<div class="my-auto text-white-800 py-1 px-4 border-2 border-white-500 hover:bg-white-500 hover:cursor-pointer hover:text-white rounded-3xl mx-2">Invite</div>
		</div>
	</div>
	</div>
  </template>
  

<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue';
import { useCurrentUserStore } from '@/stores/currentUser';
import UserService from '@/services/UserService';
import FriendService from '@/services/FriendService';
import type { IUser } from '@/models/IUser';

const currentUser = ref(useCurrentUserStore());
const isChangingUsername = ref(false);
const newUsername = ref('');
const errorMessage = ref('');

const props = defineProps({
  idProfile: String,
});

const profile = ref<IUser>();

async function fetchUsers() {
  profile.value = await UserService.getUserById(props.idProfile!);
}

// Using watchEffect to observe changes to props.idProfile
watchEffect(() => {
  fetchUsers();
});

const isOwnProfile = computed(() => currentUser.value.userId === profile.value?.id);
const usernameDisplay = computed(() => isOwnProfile.value ? currentUser.value.username : profile.value?.username);
const friendsButton = ref(true)
async function updateName() {
  if (!newUsername.value.trim()) {
    errorMessage.value = 'Username cannot be empty';
    return;
  } else {
    errorMessage.value = '';
  }
  await currentUser.value.updateUser(newUsername.value);
  isChangingUsername.value = false;
  newUsername.value = '';
}

const showUsernameChange = () => {
	isChangingUsername.value = !isChangingUsername.value;
};

async function friendRequest() {
    const response = await FriendService.sendFriendRequest(props.idProfile!);
	console.log("Dio bue", response.data)
	if (response.data)
	{
		friendsButton.value = false;
	}
}

async function friendremove() {
    const response = await FriendService.endFriendship("64a3a5e2-b537-4896-ab69-b936449e964d");
	console.log("Dio asinello", response)
	if (response)
	{
		console.log("asasas")
	}

}
</script>

<style scoped>
/* Your styles here */
</style>