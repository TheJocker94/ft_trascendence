<template>
	<div v-if="user">
    <h1>{{ user.username }}</h1>
    <img :src="user.profilePicture" alt="User's profile picture" />
    <!-- Add other user details here -->
	</div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import UserService from '@/services/UserService';
import AuthService from '@/services/AuthService';
  
  interface User {
	username: string;
	profilePicture: string;
	// Add other properties as needed
  }
  
  const route = useRoute();
  const userId = route.params.userId;
  
  const user = ref<User | null>(null);
  
  onMounted(async () => {
	user.value = await UserService.getUserById(userId);
  AuthService.online();
  });
  </script>