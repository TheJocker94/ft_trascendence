<template>
	<div>
		<div class="stats shadow mx-auto grid grid-cols-3 gap-4 justify-items-center">
  
			<div class="stat place-items-center">
				<div class="stat-title">Win</div>
				<div class="stat-value text-secondary">{{ profile?.Wins }}</div>
				<!-- <div class="stat-desc">From January 1st to February 1st</div> -->
			</div>
			
			<div class="stat place-items-center">
				<div class="stat-title">Loss</div>
				<div class="stat-value text-red-500">{{ profile?.Losses }}</div>
				<!-- <div class="stat-desc text-secondary">↗︎ 40 (2%)</div> -->
			</div>

			<div class="stat place-items-center">
				<div class="stat-title">Winrate</div>
				<div class="stat-value">{{ profile?.winrate }} %</div>
				<!-- <div class="stat-desc">From January 1st to February 1st</div> -->
			</div>
			
			</div>
	</div>
	<div v-if="userStore.userId === props.idProfile" >
		<!-- text style bold tailwind -->
        <h1 class="text-center  text-white  my-3">Match History</h1>
	<div v-if="MatcHistory.length > 0" class="overflow-x-auto">
    <table class="table table-sm">
    <!-- head -->
      <thead>
        <tr>
          <th>User</th>
          <th>Mode</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
      <!-- row 1 -->
      <tr v-for="(match, index) in MatcHistory" :key="index" :class="[match.winnerUsername === userStore.username ? 'bg-green-700' : 'bg-red-700']">
        <td>
          <div class="flex items-center">
			<div v-if="match.user2Id.id !== userStore.userId">
				<div class="avatar">
					<div class="mask mask-squircle w-12 h-12">
					<img :src="match.user2Id.profilePicture" alt="Avatar Tailwind CSS Component" />
					</div>
				</div>
				<div>
					<div class="font-bold">{{ match.user2Id.username }}</div>
				</div>
			</div>
			<div v-if="match.user1Id.id !== userStore.userId">
				<div class="avatar">
					<div class="mask mask-squircle w-12 h-12">
					<img :src="match.user1Id.profilePicture" alt="Avatar Tailwind CSS Component" />
					</div>
				</div>
				<div>
					<div class="font-bold">{{ match.user1Id.username }}</div>
				</div>
			</div>
          </div>
        </td>
        <td>
          {{ match.mode }}
          <br/>
          <span class="badge badge-ghost badge-sm">{{ match.score }}</span>
        </td>
        <td v-if="match.winnerUsername === userStore.username" >Win</td>
        <td v-else >Lose</td>
      </tr>
      </tbody>    
    </table>
	</div>
	<div v-else class="text-center">No match played yet</div>
</div>
</template>

<script setup lang="ts">
import {onMounted, ref, watchEffect } from 'vue';
import UserService from '@/services/UserService';
import { useCurrentUserStore } from '@/stores/currentUser';
import type { IUser } from '@/models/IUser';
import type { IMatchHistory } from '@/models/IUser';

const props = defineProps({
  idProfile: String,
});
const userStore = ref(useCurrentUserStore());
const profile = ref<IUser>();
const MatcHistory = ref<IMatchHistory[]>([] as IMatchHistory[])
const getMatchHistory = async () => {
   MatcHistory.value = await UserService.getMatchHistory();
// For every match in the match history, we want to get only the matches where the user is involved
//
//	
//
	MatcHistory.value = MatcHistory.value.filter(match => match.user1Id.id == userStore.value.userId || match.user2Id.id == userStore.value.userId);
    // console.log('MatcHistory',MatcHistory.value);
}
onMounted(() => {
    getMatchHistory();
});

async function fetchUsers() {
  profile.value = await UserService.getUserById(props.idProfile!);
}

// Using watchEffect to observe changes to props.idProfile
watchEffect(() => {
  fetchUsers();
});
</script>

<style scoped>

</style>
