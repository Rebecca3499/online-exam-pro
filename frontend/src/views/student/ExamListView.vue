<template>
  <div v-loading="loading" class="page-content">
    <PageHeader title="选择并开始考试" subtitle="查看已发布考试，阅读规则后进入在线答题流程。" eyebrow="考生端" />
    <div v-if="!exams.length" class="panel"><EmptyState text="暂无已发布考试" /></div>
    <div class="exam-grid">
      <article v-for="exam in exams" :key="exam.id" class="exam-card">
        <div>
          <el-tag class="tag-published">已发布</el-tag>
          <h2>{{ exam.title }}</h2>
          <p>{{ exam.description }}</p>
        </div>
        <div class="exam-meta">
          <span><el-icon><Timer /></el-icon>{{ exam.duration }} 分钟</span>
          <span><el-icon><Medal /></el-icon>{{ exam.total_score }} 分</span>
          <span><el-icon><Document /></el-icon>{{ exam.question_count }} 题</span>
        </div>
        <el-button type="primary" size="large" icon="Right" @click="$router.push(`/student/exams/${exam.id}/intro`)">开始考试</el-button>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import { getExams } from '@/api/exams'

const exams = ref<any[]>([])
const loading = ref(false)
onMounted(async () => {
  loading.value = true
  try {
    exams.value = await getExams({ published: 1 }) as any[]
  } finally {
    loading.value = false
  }
})
</script>
