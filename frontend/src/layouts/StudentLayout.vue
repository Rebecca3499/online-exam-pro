<template>
  <div class="student-shell">
    <header class="student-header">
      <div class="brand dark">
        <div class="brand-mark">智</div>
        <div>
          <span>智测云</span>
          <small>Online Exam Pro</small>
        </div>
      </div>
      <nav>
        <router-link to="/student/exams">考试列表</router-link>
        <router-link to="/student/results">我的成绩</router-link>
        <div class="user-avatar">{{ auth.user?.name?.slice(0, 1) || '学' }}</div>
        <span>{{ auth.user?.name }}</span>
        <el-button text icon="SwitchButton" @click="logout">退出登录</el-button>
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
