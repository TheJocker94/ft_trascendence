<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import PhaserContainer from '@/components/PhaserContainer.vue'
import { socketGame/*, socketNoti */} from '@/plugins/Socket.io';
import { useCurrentUserStore } from '@/stores/currentUser';
import { useAuthStore } from '@/stores/auth';
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router';

const authStore = ref(useAuthStore());
const router = useRouter();
const userStore = ref(useCurrentUserStore());
const press = ref(false);
const leaveQ = ref(false);
const goGame = ref(false);
// On Loading the page
onMounted(async () => {
  await userStore.value.initStore(null, null);
  socketGame.auth = { token: authStore.value.token }
  socketGame.connect();
  socketGame.on('welcome', (data: any) => {
  });
})


const isBrowserMinimized = ref(false);
const handleVisibilityChange = () => {
  isBrowserMinimized.value = document.hidden;
  if (isBrowserMinimized.value === true && userStore.value.roomId) {
			socketGame.emit('pause', {room: userStore.value.roomId, player : userStore.value.playerNo});
  }
	else if (isBrowserMinimized.value === false && userStore.value.roomId)
		socketGame.emit('unpause', {room: userStore.value.roomId, player : userStore.value.playerNo}); 
};


onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

// Assicurati di rimuovere l'ascoltatore quando il componente viene smontato
const teardown = () => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
};

// On leaving the page
onUnmounted(() => {
	teardown();
	socketGame.off('pauseServer');
	socketGame.off('unpauseServer');
    socketGame.offAny();
    socketGame.off('playerDisconnected');
    socketGame.off('restartServer');
    socketGame.off('gameCreated');
    socketGame.off('playerNo');
    socketGame.off('startingGame');
    socketGame.off('joinQueue');
    // socketGame.off('leaveRoom');
    socketGame.off('disconnect');
    socketGame.off('connect');
    socketGame.off('connect_error');
    socketGame.off('connect_timeout');
    socketGame.off('error');
    socketGame.off('choose');
    socketGame.off('move');
    socketGame.off('ballUpdateServer');
    socketGame.off('updateScoreServer');
    socketGame.off('powerupServer');
    socketGame.off('powerballUpdateServer');
    socketGame.off('powerdoitServer');
    socketGame.off('hitPaddleServer');
    socketGame.off('start');
    socketGame.disconnect();
	/*socketNoti.connect();*/
})
// Create a game
const createGame = () => {
  socketGame.emit('joinQueue');
  leaveQ.value = true;
  
}

const exitQueue = () => {
  socketGame.emit('leaveQueue');
}

socketGame.on('playerDisconnected', data => {
  press.value = false;
  goGame.value = false;
  leaveQ.value = false;
  socketGame.emit('leaveRoom', userStore.value.roomId);
  router.push({ name: 'home' });
  //alert("Game Created! ID is: "+ JSON.stringify(data));
});
socketGame.on('gameCreated', function (data) {

  });
  socketGame.on('playerNo', function (data) {
    userStore.value.initGame(data.room, data.player, data.username1, data.username2);
  });
  
  socketGame.on('startingGame', function (data) {
    goGame.value = true;
    leaveQ.value = false;
    press.value = true;
  });

</script>

<template>
  <div class="flex flex-col items-center justify-center mt-45">
    <div v-if="!press" class="flex flex-col items-center">
      <button @click="createGame(), press = true" class="btn btn-secondary btn-xs sm:btn-sm md:btn-md lg:btn-lg mb-3 mt-4">Create Game</button>
      <!-- <button @click="joinGame()" class="btn  btn-primary btn-xs sm:btn-sm md:btn-md lg:btn-lg">Join Game</button> -->
    </div>
    <div v-if="leaveQ" class="flex flex-col items-center">
    <button class="btn no-animation btn-accent btn-xs sm:btn-sm md:btn-md lg:btn-lg mb-3 mt-4">Searching for a player
        <span class="loading loading-spinner loading-lg"></span>
    </button>
      <button @click="exitQueue(), leaveQ = false, press = false" class="btn  btn-neutral btn-xs sm:btn-sm md:btn-md lg:btn-lg mb-4 mt-4">Leave Matchmaking</button>
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
