<template>
    <div v-if="profileFriend">
        <h4 class="text-sm text-center my-2 font-semibold text-white-700">Friends</h4>
        <div class="avatar-group -space-x-6 flex justify-center items-center">
          <!-- Loop through the first 3 friends -->
          <div class="avatar" v-for="friend in profileFriend!.slice(0, 3)" :key="friend.id">
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
          <!-- Show the remaining count if there are more than 3 friends -->
          <div class="avatar placeholder" v-if="profileFriend!.length > 3">
            <div class="w-12 bg-neutral-focus text-neutral-content">
              <span>+{{ profileFriend!.length - 3 }}</span>
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
// import { useCurrentUserStore } from '@/stores/currentUser';

// const props = defineProps({
//   idProfile: String,
// });
const profileFriend = ref<IFriend[]>();
// const currentUser = ref(useCurrentUserStore());
async function friendPic() {
    // if (props.idProfile !== currentUser.value.userId)
        profileFriend.value = await FriendService.getFriendList();
    // else
    //     profileFriend.value = await FriendService.getFriendList(currentUser.value.userId!);
}


// Using watchEffect to observe changes to props.idProfile
watchEffect(() => {
    friendPic();
});

</script>

<style scoped>

</style>