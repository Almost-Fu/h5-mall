import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import * as userApi from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))

  function setLogin(data: { token: string; user: User }) {
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const res = await userApi.getMe()
      user.value = res.data
      localStorage.setItem('user', JSON.stringify(res.data))
    } catch (e) {
      /* 忽略 */
    }
  }

  return { token, user, setLogin, logout, fetchMe }
})
