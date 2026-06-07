<template>
  <div class="login-page">
    <section class="login-visual">
      <div class="hero-copy">
        <p>Online Exam Pro</p>
        <h1>智测云</h1>
        <span>从组卷、考试到成绩分析的一体化教学测评平台</span>
      </div>
    </section>
    <el-card class="login-card">
      <h2>账号登录</h2>
      <p class="muted">管理员和考生将进入不同工作台</p>
      <el-form :model="form" @keyup.enter="handleLogin">
        <el-form-item>
          <el-input v-model="form.username" size="large" placeholder="用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" size="large" placeholder="密码" type="password" show-password prefix-icon="Lock" />
        </el-form-item>
        <el-button class="full" size="large" type="primary" :loading="loading" @click="handleLogin">登录系统</el-button>
      </el-form>
      <div class="account-tips">
        <el-button text @click="fill('admin')">管理员：admin / 123456</el-button>
        <el-button text @click="fill('student')">考生：student / 123456</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const form = reactive({ username: 'admin', password: '123456' })

function fill(role: 'admin' | 'student') {
  form.username = role
  form.password = '123456'
}

async function handleLogin() {
  loading.value = true
  try {
    const user = await auth.login(form.username, form.password)
    ElMessage.success('登录成功')
    router.replace(user.role === 'admin' ? '/admin/dashboard' : '/student/exams')
  } finally {
    loading.value = false
  }
}
</script>
