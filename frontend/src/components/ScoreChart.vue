<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{ title?: string; type?: 'bar' | 'line'; data: any[]; horizontal?: boolean }>()
const chartRef = ref<HTMLDivElement>()
let chart: echarts.ECharts | null = null

function render() {
  if (!chartRef.value) return
  if (!chart) chart = echarts.init(chartRef.value)
  const names = props.data.map((item) => item.name)
  const values = props.data.map((item) => item.value)
  chart.setOption({
    title: { text: props.title || '', left: 8, top: 4, textStyle: { fontSize: 14, color: '#1f2a44' } },
    tooltip: { trigger: 'axis' },
    grid: { left: props.horizontal ? 120 : 36, right: 24, top: 48, bottom: 34 },
    xAxis: props.horizontal ? { type: 'value' } : { type: 'category', data: names, axisLabel: { interval: 0 } },
    yAxis: props.horizontal ? { type: 'category', data: names, axisLabel: { width: 104, overflow: 'truncate' } } : { type: 'value' },
    series: [{
      type: props.type || 'bar',
      data: values,
      smooth: true,
      barWidth: 24,
      itemStyle: { borderRadius: props.horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0], color: '#4f7cff' },
      areaStyle: props.type === 'line' ? { color: 'rgba(79,124,255,.12)' } : undefined
    }]
  })
}

watch(() => props.data, () => nextTick(render), { deep: true })
onMounted(() => {
  nextTick(render)
  window.addEventListener('resize', render)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', render)
  chart?.dispose()
})
</script>
