<template>
  <div v-if="profileBlocked">
      <h4 class="text-sm text-center my-2 font-semibold text-white-700 mt-2">Blocked</h4>
      <div class="avatar-group -space-x-6 flex justify-center items-center">
        <!-- Loop through the first 5 friends -->
        <div class="avatar" v-for="friend in profileBlocked!.slice(0, 5)" :key="friend.id">
          <div class="w-12">
              <router-link
  :to="{
      name: 'profile',
      params: { userid: friend.id },
  }"
  >
  <img :src="friend.profilePicture" :alt="friend.username" />
      
  </router-link> 
          </div>
        </div>
        <!-- Show the remaining count if there are more than 5 friends -->
        <div class="avatar placeholder" v-if="profileBlocked!.length > 5">
          <div class="w-12 bg-neutral-focus text-neutral-content">
            <span>+{{ profileBlocked!.length - 5 }}</span>
          </div>
        </div>
        <!-- Show "You have no friends" if the array is empty -->
        <div v-else-if="profileBlocked!.length === 0" class="text-white-700">
          You have no blocked users.
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import FriendService from '@/services/FriendService';
import type { IFriend } from '@/models/IFriendsLists'

const profileBlocked = ref<IFriend[]>();
// const currentUser = ref(useCurrentUserStore());
async function friendPic() {
    profileBlocked.value = await FriendService.getBlockedRequest();
}


// Using watchEffect to observe changes to props.idProfile
watchEffect(() => {
  friendPic();
});

</script>

<style scoped>

</style>
