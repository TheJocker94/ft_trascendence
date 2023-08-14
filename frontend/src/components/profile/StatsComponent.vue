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
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import UserService from '@/services/UserService';
import type { IUser } from '@/models/IUser';

const props = defineProps({
  idProfile: String,
});

const profile = ref<IUser>();

async function fetchUsers() {
  console.log("id new new ", props.idProfile);
  profile.value = await UserService.getUserById(props.idProfile!);
}

// Using watchEffect to observe changes to props.idProfile
watchEffect(() => {
  fetchUsers();
});
</script>

<style scoped>

</style>