<template>
    <div v-if="profileFriend">
        <h4 class="text-sm text-center my-2 font-semibold text-white-700">Friends</h4>
        <div class="avatar-group -space-x-1 flex justify-center items-center">
          <!-- Loop through the first 10 friends -->
          <div class="avatar" v-for="friend in profileFriend!.slice(0, 10)" :key="friend.id">
            <div :class="['object-cover rounded-full h-12 w-12 mx-auto m-1 p-1 border-4 relative', !friend.isOnline ? 'border-red-500' : friend.isPlaying ? 'border-purple-500' : 'border-green-600']">
                <router-link
    :to="{
        name: 'profile',
        params: { userid: friend.id },
    }"
    >
    <div class="h-full w-full overflow-hidden rounded-full">
      <img class="h-full w-full object-cover" :src="friend.profilePicture" :alt="friend.username" />
    </div>
        
    </router-link> 
            </div>
          </div>
          <!-- Show the remaining count if there are more than 10 friends -->
          <div class="avatar placeholder" v-if="profileFriend!.length > 10">
            <div class="w-12 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
              <span>+{{ profileFriend!.length - 10 }}</span>
            </div>
          </div>
          <!-- Show "You have no friends" if the array is empty -->
          <div v-else-if="profileFriend!.length === 0" class="text-white-700">
            You have no friends
          </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import FriendService from '@/services/FriendService';
import type { IFriend } from '@/models/IFriendsLists'

const profileFriend = ref<IFriend[]>();

async function friendPic() {
    profileFriend.value = await FriendService.getFriendList();
}


// Using watchEffect to observe changes to props.idProfile
watchEffect(() => {
    friendPic();
});

</script>

<style scoped>

</style>
