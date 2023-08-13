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
      <AvatarUserName :idProfile="userId"/>
      <!-- Search friend bar -->
      <div  class="text-center">
        <input v-model="searchQuery" @input="performSearch" placeholder="Search by username" class="input input-ghost" />
        <ul v-if="searchResults.length > 0 && searchQuery">
          <li v-for="result in searchResults" :key="result.id" @click="navigateToUser(result.id)">{{ result.username }}</li>
        </ul>
        <p v-else-if="searchQuery">No results found.</p>
      </div>
<!-- Friend list with avatar TODO -->
      <h4 class="text-sm text-center my-2 font-semibold text-white-700">Friends</h4>
      <div class="avatar-group -space-x-6 flex justify-center items-center">
        <div class="avatar">
          <div class="w-12">
            <img src="/src/assets/morpheus.png" />
          </div>
        </div>
        <div class="avatar">
          <div class="w-12">
            <img src="/src/assets/auth.jpg" />
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
<!--Stats user TODO -->
    <StatsComponent :idProfile="userId"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentUserStore } from '@/stores/currentUser';
import AvatarPic from '@/components/profile/AvatarPic.vue'
import AvatarUserName from '@/components/profile/AvatarUserName.vue';
import StatsComponent from '@/components/profile/StatsComponent.vue';
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