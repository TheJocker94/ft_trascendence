<template>
	<div>
		<div class="px-6 py-4">
			<div class="flex flex-col">
				<div class="flex items-center mx-auto">
					<div class="font-bold text-xl text-center text-white-800 hover:text-white-500 hover:cursor-pointer">
						{{ usernameDisplay }}
					</div>
				</div>
				<div v-if="isOwnProfile" class="mx-auto">
					<div class="flex justify-center">
						<button @click="showUsernameChange" class="text-white-800 py-1 px-4 border-2 border-white-500 hover:bg-white-500 hover:cursor-pointer hover:text-white rounded-3xl mx-2">
							Change Username
						</button>
					</div>
					<div v-if="isChangingUsername">
						<input v-model="newUsername" placeholder="Enter new username" />
						<button @click="updateName" class="my-auto text-white-800 py-1 px-4 border-2 border-white-500 hover:bg-white-500 hover:cursor-pointer hover:text-white rounded-3xl mx-2">
							Update
						</button>
						<p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
					</div>
				</div>
				<div v-else class="flex flex-row justify-center font-semibold mx-auto my-4">
					<div class="my-auto text-white bg-white-500 hover:bg-white-600 hover:cursor-pointer rounded-3xl py-2 px-4 mx-2">Follow</div>
					<div class="my-auto text-white-800 py-1 px-4 border-2 border-white-500 hover:bg-white-500 hover:cursor-pointer hover:text-white rounded-3xl mx-2">Message</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue';
import { useCurrentUserStore } from '@/stores/currentUser';
import UserService from '@/services/UserService';
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
</script>

<style scoped>
/* Your styles here */
</style>