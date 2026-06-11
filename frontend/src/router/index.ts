import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: () => import('@/views/LoginView.vue'), meta: { public: true } },
    { path: '/403', component: () => import('@/views/ForbiddenView.vue'), meta: { public: true } },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { role: 'admin' },
      redirect: '/admin/dashboard',
      children: [
        { path: 'dashboard', component: () => import('@/views/admin/DashboardView.vue') },
        { path: 'exams', component: () => import('@/views/admin/ExamManageView.vue') },
        { path: 'questions', component: () => import('@/views/admin/QuestionManageView.vue') },
        { path: 'results', component: () => import('@/views/admin/ResultManageView.vue') },
        { path: 'analysis', component: () => import('@/views/admin/AnalysisView.vue') }
      ]
    },
    {
      path: '/student',
      component: () => import('@/layouts/StudentLayout.vue'),
      meta: { role: 'student' },
      redirect: '/student/exams',
      children: [
        { path: 'exams', component: () => import('@/views/student/ExamListView.vue') },
        { path: 'exams/:id/intro', component: () => import('@/views/student/ExamIntroView.vue') },
        { path: 'exams/:id/take', component: () => import('@/views/student/ExamTakeView.vue') },
        { path: 'results', component: () => import('@/views/student/StudentResultsView.vue') },
        { path: 'results/:id', component: () => import('@/views/student/ExamResultView.vue') }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.public) return true
  if (!auth.isLogin) return '/login'
  const requiredRole = to.meta.role as string | undefined
  if (requiredRole && auth.role !== requiredRole) return '/403'
  return true
})

export default router
