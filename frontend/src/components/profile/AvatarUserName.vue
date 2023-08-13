<template>
	<div>
		<div class="px-6 py-4">
		<div class="flex flex-col">
			<div class="flex items-center mx-auto">
				<div v-if="currentUser.userId===profile?.id">
					<div class="font-bold text-xl text-center text-white-800 hover:text-white-500 hover:cursor-pointer">
					{{ currentUser.username }}
					</div>
				</div>
				<div v-else>
					<div class="font-bold text-xl text-center text-white-800 hover:text-white-500 hover:cursor-pointer">
						{{ profile?.username }}
						</div>
				</div>
			</div>
			<div v-if="currentUser.userId===profile?.id" class="mx-auto">
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
					<p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p> <!-- Display error message -->
				<!-- </div> -->
				</div>

			</div>
				</div>
				<div v-if="currentUser.userId!=profile?.id" class="flex flex-row justify-center font-semibold mx-auto my-4">
					<div class="my-auto text-white bg-white-500 hover:bg-white-600 hover:cursor-pointer rounded-3xl py-2 px-4 mx-2">Follow</div>
					<div class="my-auto text-white-800 py-1 px-4 border-2 border-white-500 hover:bg-white-500 hover:cursor-pointer hover:text-white rounded-3xl mx-2">Message</div>
				</div>
				</div>
	</div>
</template>

<script setup lang="ts">
import { useCurrentUserStore } from '@/stores/currentUser';
import { ref, onBeforeMount, onUpdated } from 'vue';
import UserService from '@/services/UserService';
import type { IUser } from '@/models/IUser';

const currentUser = ref(useCurrentUserStore());
const isChangingUsername = ref(false);
const newUsername = ref('');
const errorMessage = ref('');

const props = defineProps({
  idProfile: String,
});
// const route = useRoute();

const profile = ref<IUser>();
// const userId = ref<string | string[]>();
// userId.value = route.params.userid;
async function fetchUsers() {
  console.log("id new new ", props.idProfile);
  profile.value = await UserService.getUserById(props.idProfile!);
}

onBeforeMount(async () => {
  console.log("id new new ", props.idProfile);
  await fetchUsers();
  console.log("Profile component is ", profile.value);
});
onUpdated(async () => {
  console.log("update ", props.idProfile);
  await fetchUsers();
  console.log("Profile component update is ", profile.value);
});
async function updateName() {
  if (!newUsername.value.trim()) {  // Check if username is empty or just whitespace
    errorMessage.value = 'Username cannot be empty';  // Set the error message
    return;  // Exit the function without updating
  }
  else
  {
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

</style>