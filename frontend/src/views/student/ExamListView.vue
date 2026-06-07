<template>
  <div>
    <div class="page-title">
      <div><h1>可参加考试</h1><p>选择考试后阅读须知并开始答题</p></div>
    </div>
    <div v-if="!exams.length" class="panel"><EmptyState text="暂无已发布考试" /></div>
    <div class="exam-grid">
      <article v-for="exam in exams" :key="exam.id" class="exam-card">
        <div>
          <el-tag type="primary">已发布</el-tag>
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
import EmptyState from '@/components/EmptyState.vue'
import { getExams } from '@/api/exams'

const exams = ref<any[]>([])
onMounted(async () => {
  exams.value = await getExams({ published: 1 }) as any[]
})
</script>
