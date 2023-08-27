<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import PhaserContainer from '@/components/PhaserContainer.vue'
import { socketGame } from '@/plugins/Socket.io';
import { useCurrentUserStore } from '@/stores/currentUser';
import { useAuthStore } from '@/stores/auth';
import { onMounted, onUnmounted, ref } from 'vue'

const authStore = ref(useAuthStore());
const userStore = ref(useCurrentUserStore());
const press = ref(false);
const goGame = ref(false);
// On Loading the page
onMounted(async () => {
  await userStore.value.initStore(null, null, null);
  socketGame.auth = { token: authStore.value.token }
  console.log("Token is ", socketGame.auth)
  // socketGame.auth = { username: userStore.value.username };
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
  socketGame.emit('joinQueue');
  
}

socketGame.on('playerDisconnected', data => {
  console.log('playerDisconnected: ' + data);
  press.value = false;
  goGame.value = false;
  socketGame.emit('leaveRoom', userStore.value.roomId);
  //alert("Game Created! ID is: "+ JSON.stringify(data));
});
socketGame.on('gameCreated', function (data) {
    console.log("Game Created! ID is: " + data.IdRoom)
    console.log(' created Game: ' + data.IdRoom);

    //alert("Game Created! ID is: "+ JSON.stringify(data));
  });
  socketGame.on('playerNo', function (data) {
    console.log("Game Created! ID room is: " + data.room)
    console.log('Your id is: ' + data.player);
    userStore.value.initGame(data.room, data.player);
  });
  
  socketGame.on('startingGame', function (data) {
    console.log("Game Created! ID room is: " + data)
    goGame.value = true;
    //alert("Game Created! ID is: "+ JSON.stringify(data));
  });

</script>

<template>
  <div class="flex flex-col items-center justify-center mt-48">
    <div v-if="!press" class="flex flex-col items-center">
      <button @click="createGame(), press = !press" class="btn  btn-secondary btn-xs sm:btn-sm md:btn-md lg:btn-lg mb-4">Create Game</button>
      <!-- <button @click="joinGame()" class="btn  btn-primary btn-xs sm:btn-sm md:btn-md lg:btn-lg">Join Game</button> -->
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