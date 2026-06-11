import request from './request'

export function loginApi(data: { username: string; password: string }) {
  return request.post<any, any>('/login', data)
}
