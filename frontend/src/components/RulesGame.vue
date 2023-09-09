<template>
  <div class="flex justify-center space-x-4 mb-3 mt-4">
    <div class="card w-125 h-50 bg-green-900 shadow-xl p-4">
      <div class="flex flex-col items-center justify-center h-full">
        <h2 class="card-title text-lg mb-1">Rules</h2>
        <ul class="list-disc pl-4">
          <li>You can choose between classic or power-up mode</li>
          <li>Each player has a paddle that can be moved up and down</li>
          <li>You score a point when the ball passes the enemy's paddle</li>
          <li>The game ends when a player reaches 5 points</li>
          <li>To get a power-up, you have to hit it with the ball</li>
          <li>The power-ups have a duration of 10 seconds</li>
        </ul>
      </div>
    </div>
    <div class="card w-80 h-50 bg-green-900 shadow-xl p-4">
      <div class="flex flex-col justify-center h-full">
        <h2 class="flex justify-center card-title text-lg mb-0 items-center">Commands</h2>
        <ul class="list-disc pl-4">
          <li>W or ⇧ : move cursor up</li>
          <li>S or ⇩ : move cursor down</li>
        </ul>
        <h2 class="flex justify-center card-title text-lg mt-0 items-center">Power-ups</h2>
        <ul class="list-disc pl-4">
          <li>You can move faster</li>
          <li>Your paddle is bigger</li>
          <li>Your enemy's paddle is smaller</li>
        </ul>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">


</script>

<style scoped>

</style>
