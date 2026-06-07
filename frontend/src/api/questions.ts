import request from './request'

export function getQuestions(params?: any) {
  return request.get('/questions', { params })
}

export function createQuestion(data: any) {
  return request.post('/questions', data)
}

export function updateQuestion(id: string | number, data: any) {
  return request.put(`/questions/${id}`, data)
}

export function deleteQuestion(id: string | number) {
  return request.delete(`/questions/${id}`)
}

export function importQuestions(data: any[]) {
  return request.post('/questions/import', { items: data })
}
