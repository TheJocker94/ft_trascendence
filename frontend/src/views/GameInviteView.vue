<script setup lang="ts">
import GamePong from '@/components/GamePong.vue'
import MatcHistory from '@/components/MatcHistory.vue';
import PhaserContainer from '@/components/PhaserContainer.vue'
import { useGameStore } from '@/stores/gameInvite'
import { socketGame } from '@/plugins/Socket.io';
import { ref } from 'vue'
import { onMounted, onUnmounted, nextTick } from 'vue'
import { useCurrentUserStore } from '@/stores/currentUser';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = ref(useCurrentUserStore());
const authStore = ref(useAuthStore());


socketGame.on('playerDisconnected', data => {
//   console.log('playerDisconnected: ' + data);
  socketGame.emit('leaveRoom', userStore.value.roomId);
  router.push({ name: 'home' });
  //alert("Game Created! ID is: "+ JSON.stringify(data));
});

// socketGame.on('playerInvitedDisconnected', data => {
//   router.push({ name: 'home' });
// });

onMounted(async () => {
	// console.log("wtfffff");
	await userStore.value.initStore(null, null);
	if (authStore.value.isLoggedIn){
		socketGame.auth = { token: authStore.value.token }
		socketGame.connect();
		socketGame.on('welcome', (data: any) => {
			// console.log(data);
		});
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
})

const gameStore = ref(useGameStore());
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
