<template>
  <div>
    <div class="page-title">
      <div><h1>成绩管理</h1><p>查看全部提交记录、正确率、超时与切屏风险</p></div>
    </div>
    <div class="filter-bar">
      <el-input v-model="exam" placeholder="按考试名称筛选" clearable prefix-icon="Search" />
      <el-button type="primary" icon="Search" @click="load">查询</el-button>
    </div>
    <el-table v-loading="loading" :data="rows" class="pro-table">
      <el-table-column prop="student_name" label="考生姓名" width="120" />
      <el-table-column prop="exam_title" label="考试名称" min-width="180" />
      <el-table-column label="得分" width="110"><template #default="{ row }"><strong>{{ row.score }}/{{ row.total_score }}</strong></template></el-table-column>
      <el-table-column prop="accuracy" label="正确率" width="110"><template #default="{ row }">{{ row.accuracy }}%</template></el-table-column>
      <el-table-column prop="submitted_at" label="提交时间" min-width="170" />
      <el-table-column label="超时" width="90"><template #default="{ row }"><el-tag :type="row.is_timeout ? 'danger' : 'success'">{{ row.is_timeout ? '是' : '否' }}</el-tag></template></el-table-column>
      <el-table-column prop="switch_count" label="切屏次数" width="110" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getResults } from '@/api/results'

const rows = ref<any[]>([])
const exam = ref('')
const loading = ref(false)
async function load() {
  loading.value = true
  try { rows.value = await getResults({ exam: exam.value }) as any[] } finally { loading.value = false }
}
onMounted(load)
</script>
