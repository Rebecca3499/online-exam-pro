import { defineStore } from 'pinia'
import { getExam, getExams } from '@/api/exams'

export const useExamStore = defineStore('exam', {
  state: () => ({
    exams: [] as any[],
    currentExam: null as any,
    loading: false
  }),
  actions: {
    async fetchExams(params?: any) {
      this.loading = true
      try {
        this.exams = await getExams(params) as any[]
      } finally {
        this.loading = false
      }
    },
    async fetchExam(id: string | number) {
      this.loading = true
      try {
        this.currentExam = await getExam(id)
        return this.currentExam
      } finally {
        this.loading = false
      }
    }
  }
})
