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
			<div v-if="!isIdExistsInOtherBlocked && !isIdExistsInOtherPending && !isIdExistsInOtherFriends && !isIdExistsInOtherSent" @click="friendRequest(props.idProfile!)" class="my-auto text-white-800 bg-gray-500 hover:bg-gray-600 hover:cursor-pointer hover:text-white rounded-3xl py-2 px-4 mx-2">Add Friend</div>
			<div v-if="!isIdExistsInOtherBlocked" @click="friendBlock()" class="my-auto text-white-800 bg-red-500 hover:bg-red-600 hover:cursor-pointer hover:text-white rounded-3xl py-2 px-4 mx-2">Block</div>
			<div v-else-if="isIdExistsInOtherBlocked" @click="unblockFunction()" class="my-auto text-white-800 bg-green-500 hover:bg-green-600 hover:cursor-pointer hover:text-white rounded-3xl py-2 px-4 mx-2">UnBlock</div>
			<div @click="" class="my-auto text-white-800 py-1 px-4 border-2 border-white-500 hover:bg-white-500 hover:cursor-pointer hover:text-white rounded-3xl mx-2">Invite</div>
		</div>
	</div>
	</div>
  </template>
  

<script setup lang="ts">
import { ref, watchEffect, computed, watch, nextTick } from 'vue';
import { useCurrentUserStore } from '@/stores/currentUser';
import UserService from '@/services/UserService';
import FriendService from '@/services/FriendService';
import type { IUser } from '@/models/IUser';
import { onMounted } from 'vue';
import { useFriendStore } from '@/stores/friend';
import axios, { AxiosError } from 'axios';
import type { IError } from '@/models/IError';

const isIdExistsInOtherFriends = ref(false);
const isIdExistsInOtherPending = ref(false);
const isIdExistsInOtherSent = ref(false);
const isIdExistsInOtherBlocked = ref(false);


// onMounted(() => {
//     const hasSentFriendRequest = localStorage.getItem(`friendRequestSentTo_${props.idProfile}`);
//     if (hasSentFriendRequest) {
//         friendsButton.value = false;
//     }
// });

//! If there's a way to undo the friend request or if the friend request
//! is accepted/rejected, you might want to clear the flag from the local storage.
//! localStorage.removeItem(`friendRequestSentTo_${props.idProfile}`);

const currentUser = ref(useCurrentUserStore());
const friendStore = ref(useFriendStore());
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
// watchEffect(() => {
//   fetchUsers();
// });

const isOwnProfile = computed(() => currentUser.value.userId === profile.value?.id);
const usernameDisplay = computed(() => isOwnProfile.value ? currentUser.value.username : profile.value?.username);
// const friendsButton = ref(true)
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

watchEffect(async () => {
  // Fetch the updated lists
  await fetchUsers();
  friendStore.value.friends;
  friendStore.value.pending;
  friendStore.value.sent;
  friendStore.value.blocked;
  updateReactiveChecks();
});

// watch(friendStore.value.blocked, () => {
//   // Force re-evaluation of computed properties
//   isIdExistsInOtherBlocked.value = friendStore.value.blocked.some(friend => friend.id === props.idProfile);
// });

// nextTick(() => {
//   console.log(state.message); // Output: Hello, Vue 3!
// });

watch(() => friendStore.value.friends, () => {
    updateReactiveChecks();
}, { deep: true });

// Watch for changes in pending list
watch(() => friendStore.value.pending, () => {
    updateReactiveChecks();
}, { deep: true });

// Watch for changes in sent list
watch(() => friendStore.value.sent, () => {
    updateReactiveChecks();
}, { deep: true });

// Watch for changes in blocked list
watch(() => friendStore.value.blocked, () => {
    updateReactiveChecks();
}, { deep: true });

async function friendRequest(userId: string) {
  try {
    await FriendService.sendFriendRequest(userId);
    // Update the state after the API call
    friendStore.value.updatePendings(currentUser.value.userId);
    friendStore.value.updateFriends(currentUser.value.userId);
    friendStore.value.updateSent(currentUser.value.userId);
    friendStore.value.updateBlocked();
	updateReactiveChecks();
	location.reload();
  } catch (err) {
    const e = err as AxiosError<IError>;
    if (axios.isAxiosError(e)) return e.response?.data;
  }
}

async function friendBlock() {
  try {
    await FriendService.endFriendship(props.idProfile!);
    await FriendService.blockUser(props.idProfile!);
    // Update the state after the API call
    friendStore.value.updatePendings(currentUser.value.userId);
    friendStore.value.updateFriends(currentUser.value.userId);
    friendStore.value.updateSent(currentUser.value.userId);
    friendStore.value.updateBlocked();
	updateReactiveChecks();
	location.reload();
  } catch (err) {
    const e = err as AxiosError<IError>;
    if (axios.isAxiosError(e)) return e.response?.data;
  }
}

async function unblockFunction() {
  try {
    await FriendService.unBlockUser(props.idProfile!); // Assuming you have an unblock API method
    // Update the state after the API call
    friendStore.value.updateBlocked();
	updateReactiveChecks();
	location.reload();
  } catch (err) {
    const e = err as AxiosError<IError>;
    if (axios.isAxiosError(e)) return e.response?.data;
  }
}

function updateReactiveChecks() {
    isIdExistsInOtherFriends.value = friendStore.value.friends.some(friend => friend.id === props.idProfile);
    isIdExistsInOtherPending.value = friendStore.value.pending.some(friend => friend.id === props.idProfile);
    isIdExistsInOtherSent.value = friendStore.value.sent.some(friend => friend.id === props.idProfile);
    isIdExistsInOtherBlocked.value = friendStore.value.blocked.some(friend => friend.id === props.idProfile);
}

// const isIdExistsInOtherFriends = computed(() => {
//   const result = friendStore.value.friends.some(friend => friend.id === props.idProfile);
//   console.log("result of friend: ", result);
//   return result;
// });

// const isIdExistsInOtherPending = computed(() => {
//   const result = friendStore.value.pending.some(friend => friend.id === props.idProfile);
//   console.log("result of pending: ", result);
//   return result;
// });

// const isIdExistsInOtherSent = computed(() => {
//   const result = friendStore.value.sent.some(friend => friend.id === props.idProfile);
//   console.log("result of sent: ", result);
//   return result;
// });

// const isIdExistsInOtherBlocked = computed(() => {
//   // Ensure that the blocked list is updated and re-evaluated
//   return friendStore.value.blocked.some(friend => friend.id === props.idProfile);
// });

// async function updateAll() {
// 	isIdExistsInOtherBlocked();
// 	isIdExistsInOtherSent();
// 	isIdExistsInOtherPending();
// 	isIdExistsInOtherFriends();
// }

</script>

<style scoped>
/* Your styles here */
</style>