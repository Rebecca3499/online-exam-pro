import request from './request'

export function getExams(params?: any) {
  return request.get<any, any[]>('/exams', { params })
}

export function getExam(id: string | number) {
  return request.get<any, any>(`/exams/${id}`)
}

export function createExam(data: any) {
  return request.post<any, any>('/exams', data)
}

export function updateExam(id: string | number, data: any) {
  return request.put<any, any>(`/exams/${id}`, data)
}

export function deleteExam(id: string | number) {
  return request.delete<any, any>(`/exams/${id}`)
}

export function submitExam(data: any) {
  return request.post<any, any>('/exam/submit', data)
}
