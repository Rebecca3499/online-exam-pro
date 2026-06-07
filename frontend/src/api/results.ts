import request from './request'

export function getResults(params?: any) {
  return request.get('/results', { params })
}

export function getResult(id: string | number) {
  return request.get(`/results/${id}`)
}

export function getAnalysisSummary() {
  return request.get('/analysis/summary')
}
