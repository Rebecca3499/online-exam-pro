import request from './request'

export function getExams(params?: any) {
  return request.get('/exams', { params })
}

export function getExam(id: string | number) {
  return request.get(`/exams/${id}`)
}

export function createExam(data: any) {
  return request.post('/exams', data)
}

export function updateExam(id: string | number, data: any) {
  return request.put(`/exams/${id}`, data)
}

export function deleteExam(id: string | number) {
  return request.delete(`/exams/${id}`)
}

export function submitExam(data: any) {
  return request.post('/exam/submit', data)
}
