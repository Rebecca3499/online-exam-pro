<template>
  <div v-loading="loading" class="page-content">
    <PageHeader title="教学数据总览" subtitle="汇总考试、题库、提交与成绩分析数据，形成课堂管理全局视图。" eyebrow="智测云 Online Exam Pro">
      <template #actions>
        <el-button type="primary" icon="Refresh" @click="load">刷新数据</el-button>
      </template>
    </PageHeader>
    <section class="page-hero">
      <div>
        <div class="hero-badge"><el-icon><DataBoard /></el-icon> 管理员工作台</div>
        <h1>欢迎回来，管理员</h1>
        <p>今日可以查看考试发布情况、学生提交情况和成绩分析。</p>
      </div>
    </section>
    <div class="stats-grid">
      <StatCard label="考试总数" :value="cards.examCount || 0" icon="Tickets" description="已创建的考试数量" />
      <StatCard label="题目总数" :value="cards.questionCount || 0" icon="EditPen" description="题库累计维护题目" />
      <StatCard label="提交人数" :value="cards.submissionCount || 0" icon="UserFilled" description="已有提交记录的考生" />
      <StatCard label="平均分" :value="cards.avgScore || 0" icon="Medal" description="全部提交平均得分" />
    </div>
    <div class="chart-grid">
      <section class="panel">
        <div class="panel-head">
          <div><h2>分数段分布</h2><p>快速判断整体成绩结构</p></div>
        </div>
        <ScoreChart title="分数段分布" :data="summary.scoreBuckets || []" />
      </section>
      <section class="panel">
        <div class="panel-head">
          <div><h2>快捷操作</h2><p>课程演示时可直接进入核心功能</p></div>
        </div>
        <div class="quick-grid">
          <el-button type="primary" icon="Plus" @click="$router.push('/admin/exams')">新建考试</el-button>
          <el-button icon="Upload" @click="$router.push('/admin/questions')">导入题目</el-button>
          <el-button icon="Checked" @click="$router.push('/admin/results')">查看成绩</el-button>
          <el-button icon="TrendCharts" @click="$router.push('/admin/analysis')">成绩分析</el-button>
        </div>
      </section>
      <section class="panel span-2">
        <div class="panel-head">
          <div><h2>高频错题排行</h2><p>定位需要重点讲解的题目</p></div>
        </div>
        <ScoreChart title="题目错误率排行" :data="summary.wrongRank || []" horizontal />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import StatCard from '@/components/StatCard.vue'
import ScoreChart from '@/components/ScoreChart.vue'
import { getAnalysisSummary } from '@/api/results'

const summary = ref<any>({})
const loading = ref(false)
const cards = computed(() => summary.value.cards || {})
async function load() {
  loading.value = true
  try {
    summary.value = await getAnalysisSummary()
  } finally {
    loading.value = false
  }
}
onMounted(load)
</script>
