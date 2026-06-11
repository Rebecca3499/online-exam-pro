import request from './request'

export function getQuestions(params?: any) {
  return request.get<any, any[]>('/questions', { params })
}

export function createQuestion(data: any) {
  return request.post<any, any>('/questions', data)
}

export function updateQuestion(id: string | number, data: any) {
  return request.put<any, any>(`/questions/${id}`, data)
}

export function deleteQuestion(id: string | number) {
  return request.delete<any, any>(`/questions/${id}`)
}

export function importQuestions(data: any[]) {
  return request.post<any, any>('/questions/import', { items: data })
}
