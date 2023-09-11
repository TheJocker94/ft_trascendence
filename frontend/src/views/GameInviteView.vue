<script setup lang="ts">
import MatcHistory from '@/components/MatcHistory.vue';
import PhaserContainer from '@/components/PhaserContainer.vue'
import { useGameStore } from '@/stores/gameInvite'
import { socketGame } from '@/plugins/Socket.io';
import { ref } from 'vue'
import { onMounted, onUnmounted, nextTick } from 'vue'
import { useCurrentUserStore } from '@/stores/currentUser';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import AuthService from '@/services/AuthService';

const router = useRouter();
const userStore = ref(useCurrentUserStore());
const authStore = ref(useAuthStore());
const gameStore = ref(useGameStore());

socketGame.on('playerDisconnected', data => {
  socketGame.emit('leaveRoom', userStore.value.roomId);
  socketGame.emit('removeGameInvited', {username1: userStore.value.username1,  username2: userStore.value.username2});
  router.push({ name: 'home' });
});
socketGame.on('playerInviteNo', function (data) {
    userStore.value.initGame(data.room, data.player, data.username1, data.username2);
});

onMounted(async () => {
	await userStore.value.initStore(null, null);
  AuthService.online();
	if (authStore.value.isLoggedIn){
		socketGame.auth = { token: authStore.value.token }
		socketGame.connect();
		socketGame.on('welcome', (data: any) => {
		});
    socketGame.emit('joinGameInviteQueue', gameStore.value.getIdMatch);
	}
});

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

onUnmounted(() => {
  socketGame.emit('removeGameInvited', {username1: userStore.value.username1,  username2: userStore.value.username2});
  authStore.value.hasGameInvite = false;
	teardown();
  socketGame.off('playerInvitedDisconnected');
  socketGame.off('playerInviteNo');
  socketGame.off('startingInviteGame');
  socketGame.off('playerdDisconnected');
  socketGame.off('playerNo');
  socketGame.off('startingGame');
  socketGame.off('pauseServer');
  socketGame.off('unpauseServer');
  socketGame.offAny();
  socketGame.off('restartServer');
  socketGame.off('gameCreated');
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


</script>

<template>
	<div>
		<Suspense>
			<PhaserContainer />
			<template #fallback>
				<div class="placeholder">
					Downloading ...
				</div>
			</template>
		</Suspense>
	</div>
  <MatcHistory/>
</template>

<style>
.placeholder {
  font-size: 2rem;
  font-family: 'Courier New', Courier, monospace;
}
</style>
