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
import SearchBar from '@/components/profile/SearchBar.vue';
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userId = ref<string | string[]>();
const currentUser = ref(useCurrentUserStore());
watchEffect(async () => {
  userId.value = route.params.userid;
  console.log("userId is ", userId.value);

  if (currentUser.value.userId)
    await currentUser.value.initStore(null, null);

});

</script>