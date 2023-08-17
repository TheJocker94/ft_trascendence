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
      <SearchBar :idProfile="userId"/>
<!-- Friend list with avatar TODO -->
<div>
    <h4 class="text-sm text-center my-2 font-semibold text-white-700">Friends</h4>
    <div class="avatar-group -space-x-6 flex justify-center items-center">
      <!-- Loop through the first 3 friends -->
      <div class="avatar" v-for="(friend, index) in profileFriend!.slice(0, 3)" :key="friend.id">
        <div class="w-12">
          <img :src="friend.profilePicture" :alt="friend.username" />
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
import SearchBar from '@/components/profile/SearchBar.vue';
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useFriendStore } from '@/stores/friend';
import FriendService from '@/services/FriendService';
import type { IFriend } from '@/models/IFriendsLists'

const route = useRoute();
const userId = ref<string | string[]>();
const currentUser = ref(useCurrentUserStore());
const friendStore = ref(useFriendStore());
const profileFriend = ref<IFriend[]>()
watchEffect(async () => {
  userId.value = route.params.userid;
  console.log("userId is ", userId.value);

  if (currentUser.value.userId)
    await currentUser.value.initStore(null, null);

});

async function friend() {
	profileFriend.value = await FriendService.getFriendList(userId.value!);
}

</script>