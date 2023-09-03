<template>
    <div>
        <div  class="text-center">
            <input v-model="searchQuery" @input="performSearch" placeholder="Search by username" class="input input-ghost" />
            <ul v-if="searchResults.length > 0 && searchQuery">
              <li v-for="result in searchResults" :key="result.id" @click="navigateToUser(result.id)">{{ result.username }}</li>
            </ul>
            <p v-else-if="searchQuery">No results found.</p>
          </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue';
import { useRouter } from 'vue-router';
import UserService from '@/services/UserService';
import { useCurrentUserStore } from '@/stores/currentUser';
import type { IUser } from '@/models/IUser';

const props = defineProps({
  idProfile: String,
});

const profile = ref<IUser>();
let list = ref<IUser[]>();
const router = useRouter();

const currentUser = ref(useCurrentUserStore());
async function fetchUsers() {
  profile.value = await UserService.getUserById(props.idProfile!);
}

// Using watchEffect to observe changes to props.idProfile
watchEffect(async () => {
  fetchUsers();
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

<style scoped>

</style>