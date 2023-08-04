<script setup lang="ts">
import { RouterLink } from 'vue-router'
import axios from 'axios'
import { onMounted, ref } from 'vue'

const msg = ref('');
onMounted( () => {
  axios.get('http://localhost:3000/data')
  .then( (response) => {
    msg.value = response.data;
  })
  .catch( (error) => {
    console.log(error);
    msg.value = 'Error, backend not running';
  });
  });
</script>

<template>
<div>
  <h1>Home</h1>
  <p>Prova back {{ msg }} </p>
  <RouterLink :to="{ name: 'game' }"><button>Game</button></RouterLink>
</div>
</template>
