<template>
  <div>
    <div class="page-title">
      <div>
        <h1>后台首页</h1>
        <p>实时掌握考试、题库、提交与成绩走势</p>
      </div>
      <el-button type="primary" icon="Refresh" @click="load">刷新数据</el-button>
    </div>
    <div class="stats-grid">
      <StatCard label="考试总数" :value="cards.examCount" icon="Tickets" />
      <StatCard label="题目总数" :value="cards.questionCount" icon="EditPen" />
      <StatCard label="提交人数" :value="cards.submissionCount" icon="UserFilled" />
      <StatCard label="平均分" :value="cards.avgScore" icon="Medal" />
    </div>
    <div class="chart-grid">
      <section class="panel"><ScoreChart title="分数段分布" :data="summary.scoreBuckets || []" /></section>
      <section class="panel"><ScoreChart title="题目错误率排行" :data="summary.wrongRank || []" horizontal /></section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import StatCard from '@/components/StatCard.vue'
import ScoreChart from '@/components/ScoreChart.vue'
import { getAnalysisSummary } from '@/api/results'

const summary = ref<any>({})
const cards = computed(() => summary.value.cards || {})
async function load() {
  summary.value = await getAnalysisSummary()
}
onMounted(load)
</script>
