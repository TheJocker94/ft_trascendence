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
<!-- Blocked list with avatar -->
    <BlockedPic v-if="currentUser.userId === userId" :idProfile="userId"/>
<!-- Friend list with avatar -->
      <FriendsPic v-if="currentUser.userId === userId" :idProfile="userId"/>
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
import FriendsPic from '@/components/profile/FriendsPic.vue';
import BlockedPic from '@/components/profile/BlockedPic.vue';
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
// import { useFriendStore } from '@/stores/friend';
// import FriendService from '@/services/FriendService';
// import type { IFriend } from '@/models/IFriendsLists'

const route = useRoute();
const userId = ref<string | string[]>();
const currentUser = ref(useCurrentUserStore());
// const friendStore = ref(useFriendStore());
// const profileFriend = ref<IFriend[]>()
watchEffect(async () => {
  userId.value = route.params.userid;
  console.log("userId is ", userId.value);

  if (currentUser.value.userId)
    await currentUser.value.initStore(null, null);

});

// async function friend() {
// 	profileFriend.value = await FriendService.getFriendList(userId.value!);
// }

</script>