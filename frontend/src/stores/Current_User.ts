import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCurrentUserStore = defineStore('cur_User', () => {
  const accessToken = ref('');
  const refreshToken = ref('');

  return { accessToken, refreshToken }
})
