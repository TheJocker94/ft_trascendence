<script setup lang="ts">
import { useLoginStore } from '../stores/login';
import { ref } from 'vue';
import AuthComponent from '@/components/auth/AuthComponent.vue';
import CardPong from '@/components/CardPong.vue';
const signin = ref(useLoginStore());

</script>

<template>
<AuthComponent v-if="!signin.logged"/>
<CardPong  v-if="signin.logged"/>
</template>
