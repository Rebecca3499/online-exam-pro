<template>
  <div v-if="result" class="result-page">
    <section class="result-hero">
      <div>
        <p>考试成绩</p>
        <h1>{{ result.score }} / {{ result.total_score }}</h1>
        <span>{{ result.exam_title }} · {{ result.student_name }}</span>
      </div>
      <el-button type="primary" icon="Download" @click="exportResultPdf(result)">导出 PDF 报告</el-button>
    </section>
    <div class="stats-grid">
      <StatCard label="正确题数" :value="result.correct_count" icon="CircleCheck" />
      <StatCard label="错误题数" :value="result.wrong_count" icon="CircleClose" />
      <StatCard label="正确率" :value="`${result.accuracy}%`" icon="TrendCharts" />
      <StatCard label="切屏次数" :value="result.switch_count" icon="WarnTriangleFilled" />
    </div>
    <section class="panel">
      <div class="section-head"><h2>错题解析</h2><el-tag :type="result.is_timeout ? 'danger' : 'success'">{{ result.is_timeout ? '超时提交' : '正常提交' }}</el-tag></div>
      <EmptyState v-if="wrongList.length === 0" text="全部答对，表现很稳" />
      <div v-for="item in wrongList" :key="item.questionId" class="analysis-item">
        <h3>{{ item.title }}</h3>
        <p>你的答案：<strong>{{ answerLabel(item.userAnswer) }}</strong>　正确答案：<strong>{{ item.correctAnswer }}</strong></p>
        <p class="muted">{{ item.analysis }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import StatCard from '@/components/StatCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { getResult } from '@/api/results'
import { answerLabel } from '@/utils/format'
import { exportResultPdf } from '@/utils/pdf'

const route = useRoute()
const result = ref<any>()
const wrongList = computed(() => (result.value?.detail || []).filter((item: any) => !item.isCorrect))
onMounted(async () => {
  result.value = await getResult(route.params.id as string)
})
</script>
