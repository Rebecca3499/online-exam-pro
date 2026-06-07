<template>
  <div>
    <div class="page-title">
      <div><h1>成绩分析</h1><p>以分布、趋势与高错题辅助教学复盘</p></div>
      <el-button type="primary" icon="Refresh" @click="load">更新分析</el-button>
    </div>
    <div class="chart-grid wide">
      <section class="panel"><ScoreChart title="分数段分布" :data="summary.scoreBuckets || []" /></section>
      <section class="panel"><ScoreChart title="平均分趋势" type="line" :data="summary.trend || []" /></section>
      <section class="panel span-2"><ScoreChart title="高错题排行榜" :data="summary.wrongRank || []" horizontal /></section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ScoreChart from '@/components/ScoreChart.vue'
import { getAnalysisSummary } from '@/api/results'

const summary = ref<any>({})
async function load() {
  summary.value = await getAnalysisSummary()
}
onMounted(load)
</script>
