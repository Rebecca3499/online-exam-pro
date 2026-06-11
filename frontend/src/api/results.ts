import request from './request'

export function getResults(params?: any) {
  return request.get<any, any[]>('/results', { params })
}

export function getResult(id: string | number) {
  return request.get<any, any>(`/results/${id}`)
}

export function getAnalysisSummary() {
  return request.get<any, any>('/analysis/summary')
}
