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
  else if (isBrowserMinimized.value === false && userStore.value.roomId) {
    socketGame.emit('unpause', {room: userStore.value.roomId, player : userStore.value.playerNo}); 
  }
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
})

// Create a game
socketGame.on('playerDisconnected', data => {
  press.value = false;
  goGame.value = false;
  socketGame.emit('leaveRoom', userStore.value.roomId);
  router.push({ name: 'home' });
});

socketGame.on('gameCreated', function (data) {
});

socketGame.on('playerNo', function (data) {
  userStore.value.initGame(data.room, data.player);
});
  
socketGame.on('startingGame', function (data) {
  goGame.value = true;
  press.value = true;
});

</script>

<template>
  <div class="flex flex-col items-center justify-center mt-45">
    <div class="flex flex-col items-center">
	  <button class="btn no-animation btn-accent btn-xs sm:btn-sm md:btn-md lg:btn-lg mb-3 mt-4">Waiting the player to accept the invitation
        <span class="loading loading-spinner loading-lg"></span>
	  </button>
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
