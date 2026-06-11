<template>
  <div v-loading="loading" class="page-content">
    <PageHeader title="成绩报告列表" subtitle="查看已提交考试的得分、正确率和报告详情。" eyebrow="我的成绩" />
    <div v-if="!rows.length" class="panel"><EmptyState text="暂无成绩记录" /></div>
    <div v-else class="exam-grid">
      <article v-for="row in rows" :key="row.id" class="exam-card">
        <div>
          <el-tag :class="row.is_timeout ? 'tag-timeout' : 'tag-published'">{{ row.is_timeout ? '超时提交' : '正常提交' }}</el-tag>
          <h2>{{ row.exam_title }}</h2>
          <p>{{ row.submitted_at }}</p>
        </div>
        <div class="exam-meta">
          <span>得分 {{ row.score }}/{{ row.total_score }}</span>
          <span>正确率 {{ row.accuracy }}%</span>
          <span>切屏 {{ row.switch_count }} 次</span>
        </div>
        <el-button type="primary" size="large" icon="View" @click="$router.push(`/student/results/${row.id}`)">查看报告</el-button>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getResults } from '@/api/results'
import EmptyState from '@/components/EmptyState.vue'
import PageHeader from '@/components/PageHeader.vue'

const rows = ref<any[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    rows.value = await getResults() as any[]
  } finally {
    loading.value = false
  }
})
</script>
