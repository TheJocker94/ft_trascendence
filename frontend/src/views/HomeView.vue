<script setup lang="ts">
// import { useLoginStore } from '../stores/login';
import { onMounted, ref } from 'vue';
import AuthComponent from '@/components/auth/AuthComponent.vue';
import { useAuthStore } from '@/stores/auth';
import CardPong from '@/components/CardPong.vue';
import AuthService from '@/services/AuthService';
const authStore = ref(useAuthStore());

// se serve async onMounted( async ()=> { 
onMounted(() => {
   AuthService.online();
});

</script>

<template>
<AuthComponent v-if="!authStore.isLoggedIn"/>
<CardPong  v-if="authStore.isLoggedIn"/>
</template>
