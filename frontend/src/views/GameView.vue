<script setup lang="ts">
import GamePong from '@/components/GamePong.vue'
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
  <GamePong />
  <RulesGame/>
  <MatcHistory/>
</template>

<style>
</style>
