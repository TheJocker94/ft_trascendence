<template>
    <div>
        <h1 class="text-center">Match History</h1>
        <div class="overflow-x-auto">
  <table class="table">
    <!-- head -->
    <thead>
      <tr>
        <th>Users</th>
        <th>Mode</th>
        <th>Winner</th>
      </tr>
    </thead>
    <tbody>
      <!-- row 1 -->
      <tr v-for="(match, index) in MatcHistory" :key="index">
        <td>
          <div class="flex items-center space-x-3">
            <div class="avatar">
              <div class="mask mask-squircle w-12 h-12">
                <img :src="match.user2Id.profilePicture" alt="Avatar Tailwind CSS Component" />
              </div>
            </div>
            <div>
              <div class="font-bold">{{match.user2Id.username}}</div>
            </div>
            <div class="avatar">
              <div class="mask mask-squircle w-12 h-12">
                <img :src="match.user1Id.profilePicture" alt="Avatar Tailwind CSS Component" />
              </div>
            </div>
            <div>
              <div class="font-bold">{{match.user1Id.username}}</div>
            </div>
          </div>
        </td>
        <td>
          {{ match.mode }}
          <br/>
          <span class="badge badge-ghost badge-sm">{{ match.score }}</span>
        </td>
        <td>{{match.winnerUsername}}</td>
      </tr>
    </tbody>    
  </table>
</div>
    </div>
</template>

<script setup lang="ts">
import UserService from '@/services/UserService';
import { onMounted, ref } from 'vue';
import type { IMatchHistory } from '@/models/IUser';
const MatcHistory = ref<IMatchHistory[]>([] as IMatchHistory[])
const getMatchHistory = async () => {
   MatcHistory.value = await UserService.getMatchHistory();
    console.log('MatcHistory',MatcHistory.value);
}
onMounted(() => {
    getMatchHistory();
});
</script>

<style scoped>

</style>