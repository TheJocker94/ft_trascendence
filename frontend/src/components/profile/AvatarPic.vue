<template>
	<div>
    <div v-if="profile">
      <div v-if="currentUser.userId===profile?.id">
        <div class="flex justify-center items-center">
          <div class="avatar indicator mx-auto">
			<span v-if="profile.isPlaying" class="indicator-item indicator-bottom indicator-start badge bg-purple-500">Playing</span>
            <span v-else="profile.isOnline && !profile.isPlaying" class="indicator-item indicator-bottom indicator-start badge bg-green-600">Online</span>
            <!-- <span v-else-if="!profile.isOnline" class="indicator-item indicator-bottom indicator-start badge bg-red-500">Offline</span> -->
            <div class="indicator-item indicator-bottom">
              <button @click="triggerImageUpload" class="text-white-800 bg-gray-500 hover:bg-gray-600 hover:cursor-pointer hover:text-white rounded-3xl py-2 px-4 mx-2">
                <i class="fa-solid fa-upload"></i>
              </button>
              <input type="file" ref="imageInput" @change="handleImageChange" style="display: none;" />
            </div> 
              <div :class="['object-cover rounded-full h-36 w-36 mx-auto m-1 p-1 border-4 relative', profile.isPlaying ? 'border-purple-500' : 'border-green-600']">
                <div class="h-full w-full overflow-hidden rounded-full">
                  <img :src="currentUser.avatar" alt="avatar" class="h-full w-full object-cover" />
                </div>
              </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="flex justify-center items-center">
          <div class="avatar indicator mx-auto">
            <span v-if="profile.isOnline && !profile.isPlaying" class="indicator-item indicator-bottom indicator-start badge bg-green-600">Online</span>
            <span v-else-if="profile.isPlaying" class="indicator-item indicator-bottom indicator-start badge bg-purple-500">Playing</span>
            <span v-else-if="!profile.isOnline" class="indicator-item indicator-bottom indicator-start badge bg-red-500">Offline</span>
        <div :class="['object-cover rounded-full h-36 w-36 mx-auto m-1 p-1 border-4', !profile.isOnline ? 'border-red-500' : profile.isPlaying ? 'border-purple-500' : 'border-green-600']">
          <div class="h-full w-full overflow-hidden rounded-full">
            <img :src="profile.profilePicture" alt="avatar" class="h-full w-full object-cover" />
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
	</div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useCurrentUserStore } from '@/stores/currentUser';
import UserService from '@/services/UserService';
import type { IUser } from '@/models/IUser';

const props = defineProps({
  idProfile: String,
});

const profile = ref<IUser>();
const suca = ref<string>("");
async function fetchUsers() {
  profile.value = await UserService.getUserById(props.idProfile!);
}

// Using watchEffect to observe changes to props.idProfile
watchEffect(() => {
  fetchUsers();
});

const currentUser = ref(useCurrentUserStore());
const imageInput = ref<HTMLInputElement | null>(null);
const triggerImageUpload = () => {
  if (imageInput.value) {
    imageInput.value.click();
  }
};
const handleImageChange = async () => {
  if (imageInput.value && imageInput.value.files) {
    const file = imageInput.value.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result;
        if (typeof dataUrl === 'string') {
          await currentUser.value.updatePicture(dataUrl);
        }
      };
      reader.readAsDataURL(file);
      if (currentUser.value.userId)
        await currentUser.value.initStore(null, null);
    }
  }
};
</script>


<style scoped>

</style>
