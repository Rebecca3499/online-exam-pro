import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})

request.interceptors.response.use(
  (response) => {
    const body = response.data
    if (body?.code === 0) return body.data
    ElMessage.error(body?.message || '请求失败')
    return Promise.reject(new Error(body?.message || '请求失败'))
  },
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message || '网络异常'
    if (status === 401) {
      useAuthStore().logout()
      router.replace('/login')
    } else if (status === 403) {
      router.replace('/403')
    }
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default request
