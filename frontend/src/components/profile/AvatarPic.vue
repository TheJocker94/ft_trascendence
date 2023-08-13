<template>
	<div>
    <div v-if="profile">
      <div v-if="currentUser.userId===profile?.id">
        <img class="object-cover rounded-full h-36 w-36 mx-auto m-1 p-1 border-4 border-white-600" :src="currentUser.avatar" alt="Morpheus" />
      </div>
      <div v-else>
        <img class="object-cover rounded-full h-36 w-36 mx-auto m-1 p-1 border-4 border-white-600" :src="profile.profilePicture" alt="Morpheus" />
      </div>
    </div>
	<div class="flex justify-center mt-2">
    <div v-if="currentUser.userId===profile?.id">
      <button @click="triggerImageUpload" class="bg-blue-500 text-white px-4 py-2 rounded">
        Change Profile Picture
      </button>
      <input type="file" ref="imageInput" @change="handleImageChange" style="display: none;" />
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

async function fetchUsers() {
  console.log("id new new ", props.idProfile);
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