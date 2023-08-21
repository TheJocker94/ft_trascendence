<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import PhaserContainer from '@/components/PhaserContainer.vue'
import { socketGame } from '@/plugins/Socket.io';
import { useCurrentUserStore } from '@/stores/currentUser';
import { onMounted, onUnmounted, ref } from 'vue'
const userStore = ref(useCurrentUserStore());
const goGame = ref(false);
// On Loading the page
onMounted(async () => {
  await userStore.value.initStore(null, null);
  socketGame.auth = { username: userStore.value.username };
  socketGame.connect();
  socketGame.on('welcome', (data: any) => {
    console.log(data);
  });
})
// On leaving the page
onUnmounted(() => {
  socketGame.disconnect();
})
// Create a game
const createGame = () => {
  socketGame.emit('createGame');
  
}
socketGame.on('gameCreated', function (data) {
    console.log("Game Created! ID is: " + data.IdRoom)
    console.log(' created Game: ' + data.IdRoom);

    //alert("Game Created! ID is: "+ JSON.stringify(data));
  });
// Join a game
const joinGame = () => {
  socketGame.emit('joinGame');
  socketGame.on('gameJoined', (data: any) => {
    console.log(data);
    goGame.value = true;
  })
}
</script>

<template>
  <div class="flex flex-col items-center justify-center mt-48">
    <div v-if="!goGame" class="flex flex-col items-center">
      <button @click="createGame()" class="btn  btn-secondary btn-xs sm:btn-sm md:btn-md lg:btn-lg mb-4">Create Game</button>
      <button @click="joinGame()" class="btn  btn-primary btn-xs sm:btn-sm md:btn-md lg:btn-lg">Join Game</button>
    </div>
    <div v-if="goGame">
      <Suspense>
        <PhaserContainer />
  
        <template #fallback>
          <div class="placeholder">
            Downloading ...
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<style scoped>
.placeholder {
  font-size: 2rem;
  font-family: 'Courier New', Courier, monospace;
}
</style>