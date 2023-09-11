<template>
    <div>
        <div  class="text-center mb-4">
            <input v-model="searchQuery" @input="performSearch" placeholder="Search by username" class="mb-2 btn-wide input input-md input-bordered max-w-xs search-bar" />
            <ul v-if="searchResults.length > 0 && searchQuery">
              <li v-for="result in searchResults" :key="result.id" @click="navigateToUser(result.id)" class="mb-1 mt-1 btn btn-sm btn-outline btn-wide btn-accent search-results">{{ result.username }}</li>
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

// elimina input quando clicchi fuori
document.addEventListener('click', handleClickOutside);
function handleClickOutside(event: MouseEvent) {
  const searchBar = document.querySelector('.search-bar');
  if (searchBar && !searchBar.contains(event.target as Node)) {
    searchQuery.value = '';
  }
}

// Using watchEffect to observe changes to props.idProfile
watchEffect(async () => {
  fetchUsers();
  const pippo = await UserService.getUsers();
  list.value = pippo;
  const usernameIdArray: string[] = pippo.map(obj => `${obj.username}: ${obj.id}`);
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
	router.push(`/users/${userId}`);
};
</script>

<style scoped>

</style>
