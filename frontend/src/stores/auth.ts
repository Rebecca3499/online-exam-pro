import { defineStore } from 'pinia'
import { loginApi } from '@/api/auth'
import { getStorage, removeStorage, setStorage } from '@/utils/storage'

export interface UserInfo {
  id: number
  username: string
  role: 'admin' | 'student'
  name: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getStorage('token', ''),
    user: getStorage<UserInfo | null>('user', null)
  }),
  getters: {
    isLogin: (state) => Boolean(state.token && state.user),
    role: (state) => state.user?.role
  },
  actions: {
    async login(username: string, password: string) {
      const data: any = await loginApi({ username, password })
      this.token = data.token
      this.user = data.user
      setStorage('token', data.token)
      setStorage('user', data.user)
      return data.user
    },
    logout() {
      this.token = ''
      this.user = null
      removeStorage('token')
      removeStorage('user')
    }
  }
})
