<template>
  <div v-loading="loading" class="page-content">
    <PageHeader title="洞察考试表现" subtitle="通过分数分布、提交趋势和高频错题定位教学复盘重点。" eyebrow="成绩分析">
      <template #actions>
        <el-button type="primary" icon="Refresh" @click="load">更新分析</el-button>
      </template>
    </PageHeader>
    <div class="chart-grid wide">
      <section class="panel">
        <div class="panel-head"><div><h2>分数段分布</h2><p>展示不同分数区间的提交数量</p></div></div>
        <ScoreChart title="分数段分布" :data="summary.scoreBuckets || []" />
      </section>
      <section class="panel">
        <div class="panel-head"><div><h2>提交成绩趋势</h2><p>按提交顺序查看每次成绩变化</p></div></div>
        <ScoreChart title="提交成绩趋势" type="line" :data="summary.trend || []" />
      </section>
      <section class="panel span-2">
        <div class="panel-head"><div><h2>高频错题排行</h2><p>用于答辩展示教学诊断和复盘能力</p></div></div>
        <ScoreChart title="高错题排行榜" :data="summary.wrongRank || []" horizontal />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ScoreChart from '@/components/ScoreChart.vue'
import PageHeader from '@/components/PageHeader.vue'
import { getAnalysisSummary } from '@/api/results'

const summary = ref<any>({})
const loading = ref(false)
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
