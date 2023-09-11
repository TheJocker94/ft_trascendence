<script setup lang="ts">
import GameInvPong from '@/components/GameInvPong.vue'
import MatcHistory from '@/components/MatcHistory.vue';
import RulesGame from '@/components/RulesGame.vue';
import AuthService from '@/services/AuthService';
import { onMounted } from 'vue';

// se serve async onMounted( async ()=> { 
onMounted(() => {
  AuthService.online();
});
</script>

<template>
  <GameInvPong />
  <RulesGame/>
  <MatcHistory/>
</template>

<style>
</style>
