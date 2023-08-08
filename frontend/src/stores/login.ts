import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', () => {
  const logged = ref(false)
  function login() {
    logged.value = !logged.value
  }

  return { logged, login }
})
