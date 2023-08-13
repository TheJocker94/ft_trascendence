<template>
  <div class="">
    <div class="max-w-sm h-auto mx-auto my-20 rounded-md overflow-hidden shadow-lg">
      <!-- boh --> 
      <Suspense>
        <template #fallback>
          <div>loading</div>
      </template>
        <AvatarPic :idProfile="userId"/>
      </Suspense>
      <!-- <div class="flex justify-center mt-2">
      <img class="object-cover rounded-full h-36 w-36 mx-auto m-1 p-1 border-4 border-white-600" :src="currentUser.avatar" alt="Morpheus" />
      <button @click="triggerImageUpload" class="bg-blue-500 text-white px-4 py-2 rounded">
        Change Profile Picture
      </button>
      <input type="file" ref="imageInput" @change="handleImageChange" style="display: none;" />
      </div> -->
  <!-- boh -->
      <!-- <div class="px-6 py-4"> -->
        <AvatarUserName :idProfile="userId"/>
		<!-- <div class="flex flex-col">
    <div class="flex items-center">
      <div class="font-bold text-xl text-center mx-auto text-white-800 hover:text-white-500 hover:cursor-pointer">
        {{ currentUser.username }}
      </div>
    </div>
    <button @click="showUsernameChange" class="my-auto text-white-800 py-1 px-4 border-2 border-white-500 hover:bg-white-500 hover:cursor-pointer hover:text-white rounded-3xl mx-2">
      Change Username
    </button>
    <div v-if="isChangingUsername">
      <input v-model="newUsername" placeholder="Enter new username" />
      <button @click="updateName" class="my-auto text-white-800 py-1 px-4 border-2 border-white-500 hover:bg-white-500 hover:cursor-pointer hover:text-white rounded-3xl mx-2">
        Update
      </button>
     <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p> 
  </div>
          
        </div> -->
        <!-- <div class="flex flex-row justify-center font-semibold mx-auto my-4">
          <div class="my-auto text-white bg-white-500 hover:bg-white-600 hover:cursor-pointer rounded-3xl py-2 px-4 mx-2">Follow</div>
          <div class="my-auto text-white-800 py-1 px-4 border-2 border-white-500 hover:bg-white-500 hover:cursor-pointer hover:text-white rounded-3xl mx-2">Message</div>
        </div>
      </div> -->
      <!-- Search friend bar -->
      <div>
        <input v-model="searchQuery" @input="performSearch" placeholder="Search by username" />
        <ul v-if="searchResults.length > 0">
          <li v-for="result in searchResults" :key="result.id" @click="navigateToUser(result.id)">{{ result.username }}</li>
        <!-- <li v-for="result in searchResults" :key="result.id" @click="navigateToUser(result.id)">{{ result.username }}- {{ result.id }}</li> -->
        </ul>
        <p v-else>No results found.</p>
      </div>
<!-- Friend list with avatar TODO -->
      <h4 class="text-sm text-center my-2 font-semibold text-white-700">Friends</h4>
      <div class="avatar-group -space-x-6">
        <div class="avatar">
          <div class="w-12">
            <img src="/src/assets/morpheus.png" />
          </div>
        </div>
        <div class="avatar">
          <div class="w-12">
            <img src="/src/assets/morpheus.png" />
          </div>
        </div>
        <div class="avatar">
          <div class="w-12">
            <img src="/src/assets/morpheus.png" />
          </div>
        </div>
        <div class="avatar placeholder">
          <div class="w-12 bg-neutral-focus text-neutral-content">
            <span>+99</span>
          </div>
        </div>
      </div>
<!--Description user TODO -->
      <div>
        <h4 class="text-sm text-center my-2 font-semibold text-white-700">About me</h4>
        <p class="text-xs mx-6 text-justify">I specialize in designing and developing user interfaces and digital products. I don't restrict myself to design.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentUserStore } from '@/stores/currentUser';
import AvatarPic from '@/components/profile/AvatarPic.vue'
import AvatarUserName from '@/components/profile/AvatarUserName.vue';
import { ref, watchEffect, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import UserService from '@/services/UserService';
import type { IUser } from '@/models/IUser';

const router = useRouter();
const route = useRoute();
const userId = ref<string | string[]>();

const currentUser = ref(useCurrentUserStore());
let list = ref<IUser[]>();

watchEffect(async () => {
  userId.value = route.params.userid;
  console.log("userId is ", userId.value);

  if (currentUser.value.userId)
    await currentUser.value.initStore(null, null);
  
  const pippo = await UserService.getUsers();
  list.value = pippo;
  const usernameIdArray: string[] = pippo.map(obj => `${obj.username}: ${obj.id}`);
  console.log(usernameIdArray);
  console.log("Current user", currentUser.value.avatar);
});

// search bar
const searchQuery = ref('');
const searchResults = computed(() => {
  const lowercaseQuery = searchQuery.value.toLowerCase();
  if (list.value && Array.isArray(list.value)) {
    return list.value.filter(obj => obj.username.toLowerCase().includes(lowercaseQuery));
  }
  return [];
});
const performSearch = () => {
  // This function is triggered when the input value changes
};
const navigateToUser = (userId: string) => {
  console.log("Id", userId);
  router.push(`/users/${userId}`);
};
</script>