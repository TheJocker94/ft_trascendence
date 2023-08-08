<script setup lang="ts">
// import { useLoginStore } from '../stores/login';
import { ref } from 'vue';
import AuthComponent from '@/components/auth/AuthComponent.vue';
import { useAuthStore } from '@/stores/auth';
import CardPong from '@/components/CardPong.vue';
const authStore = ref(useAuthStore());

</script>

<template>
<AuthComponent v-if="!authStore.isLoggedIn"/>
<CardPong  v-if="authStore.isLoggedIn"/>
</template>
