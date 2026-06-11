<template>
  <el-container class="admin-shell">
    <el-aside width="236px" class="sidebar">
      <div class="brand">
        <div class="brand-mark">智</div>
        <div>
          <span>智测云</span>
          <small>Online Exam Pro</small>
        </div>
      </div>
      <el-menu router :default-active="$route.path" background-color="transparent">
        <el-menu-item index="/admin/dashboard"><el-icon><DataBoard /></el-icon>后台首页</el-menu-item>
        <el-menu-item index="/admin/exams"><el-icon><Tickets /></el-icon>考试管理</el-menu-item>
        <el-menu-item index="/admin/questions"><el-icon><EditPen /></el-icon>题目管理</el-menu-item>
        <el-menu-item index="/admin/results"><el-icon><Checked /></el-icon>成绩管理</el-menu-item>
        <el-menu-item index="/admin/analysis"><el-icon><TrendCharts /></el-icon>成绩分析</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="topbar">
        <div class="topbar-title">
          <strong>智测云 Online Exam Pro</strong>
          <span>教学考试管理控制台 · 统一管理考试、题库、成绩与分析报表</span>
        </div>
        <div class="user-area">
          <div class="user-avatar">{{ auth.user?.name?.slice(0, 1) || '管' }}</div>
          <span>{{ auth.user?.name }}</span>
          <el-tag type="primary">管理员</el-tag>
          <el-button text icon="SwitchButton" @click="logout">退出登录</el-button>
        </div>
      </el-header>
      <el-main class="page-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
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
