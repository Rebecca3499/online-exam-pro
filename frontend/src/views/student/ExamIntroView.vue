<template>
  <div class="intro-page" v-if="exam">
    <section class="intro-hero">
      <el-tag size="large">考试须知</el-tag>
      <h1>{{ exam.title }}</h1>
      <p>{{ exam.description }}</p>
      <div class="exam-meta">
        <span><el-icon><Timer /></el-icon>{{ exam.duration }} 分钟</span>
        <span><el-icon><Medal /></el-icon>{{ exam.total_score }} 分</span>
        <span><el-icon><Document /></el-icon>{{ exam.questions.length }} 题</span>
      </div>
    </section>
    <section class="rules-panel">
      <div class="rule"><el-icon><Clock /></el-icon><span>考试限时 {{ exam.duration }} 分钟，倒计时结束会自动提交。</span></div>
      <div class="rule"><el-icon><WarnTriangleFilled /></el-icon><span>答题过程中请勿切屏，系统会记录切屏次数。</span></div>
      <div class="rule"><el-icon><FolderChecked /></el-icon><span>选择答案后系统自动保存进度，刷新页面可恢复。</span></div>
      <div class="rule"><el-icon><CircleCheck /></el-icon><span>提交后立即自动批改并生成成绩分析报告。</span></div>
      <el-button type="primary" size="large" icon="Right" @click="$router.push(`/student/exams/${exam.id}/take`)">我已阅读，开始考试</el-button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getExam } from '@/api/exams'

const route = useRoute()
const exam = ref<any>()
onMounted(async () => {
  exam.value = await getExam(route.params.id as string)
})
</script>
