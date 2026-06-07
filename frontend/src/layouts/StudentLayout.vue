<template>
  <div class="student-shell">
    <header class="student-header">
      <div class="brand dark">
        <span>智测云</span>
        <small>Online Exam Pro</small>
      </div>
      <nav>
        <router-link to="/student/exams">考试列表</router-link>
        <span>{{ auth.user?.name }}</span>
        <el-button text @click="logout">退出</el-button>
      </nav>
    </header>
    <main class="student-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
function logout() {
  auth.logout()
  router.replace('/login')
}
</script>
