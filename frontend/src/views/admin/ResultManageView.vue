<template>
  <div class="page-content">
    <PageHeader title="查看提交记录" subtitle="查看学生考试提交、得分、正确率、切屏行为以及每题答题详情。" eyebrow="成绩管理" />
    <div class="toolbar">
      <div class="filter-bar">
        <el-input v-model="exam" placeholder="按考试名称筛选" clearable prefix-icon="Search" />
        <el-button type="primary" icon="Search" @click="load">查询</el-button>
      </div>
    </div>
    <el-table v-loading="loading" :data="rows" class="pro-table">
      <el-table-column prop="student_name" label="考生姓名" width="120" />
      <el-table-column prop="exam_title" label="考试名称" min-width="180" />
      <el-table-column label="得分" width="120"><template #default="{ row }"><span class="score-text">{{ row.score }}/{{ row.total_score }}</span></template></el-table-column>
      <el-table-column prop="accuracy" label="正确率" width="170">
        <template #default="{ row }">
          <el-progress :percentage="Number(row.accuracy)" :stroke-width="10" :show-text="false" />
          <span class="muted">{{ row.accuracy }}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="submitted_at" label="提交时间" min-width="170" />
      <el-table-column label="提交状态" width="110"><template #default="{ row }"><el-tag :class="row.is_timeout ? 'tag-timeout' : 'tag-published'">{{ row.is_timeout ? '超时提交' : '正常提交' }}</el-tag></template></el-table-column>
      <el-table-column prop="switch_count" label="切屏次数" width="110">
        <template #default="{ row }">
          <el-tag :class="row.switch_count > 0 ? 'tag-switch' : 'tag-published'">{{ row.switch_count }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" fixed="right">
        <template #default="{ row }"><el-button text icon="View" @click="openDetail(row)">详情</el-button></template>
      </el-table-column>
      <template #empty><EmptyState text="暂无成绩记录" /></template>
    </el-table>
    <el-drawer v-model="detailVisible" title="答题详情与错题解析" size="620px">
      <div v-if="selected" class="detail-stack">
        <section class="panel">
          <div class="panel-head">
            <div>
              <h3>{{ selected.exam_title }}</h3>
              <p>{{ selected.student_name }} · {{ selected.submitted_at }}</p>
            </div>
            <span class="score-text">{{ selected.score }}/{{ selected.total_score }}</span>
          </div>
          <div class="exam-meta">
            <span>正确率 {{ selected.accuracy }}%</span>
            <span>切屏 {{ selected.switch_count }} 次</span>
            <span>{{ selected.is_timeout ? '超时提交' : '正常提交' }}</span>
          </div>
        </section>
        <el-collapse>
          <el-collapse-item v-for="item in detailList" :key="item.questionId">
            <template #title>
              <div class="review-title">
                <el-tag :type="item.isCorrect ? 'success' : 'danger'">{{ item.isCorrect ? '正确' : '错误' }}</el-tag>
                <span>{{ item.title }}</span>
              </div>
            </template>
            <div class="answer-compare">
              <div :class="['answer-pill', item.isCorrect ? 'correct' : 'wrong']">
                <span>学生答案</span>
                <strong>{{ item.userAnswer || '未作答' }}</strong>
              </div>
              <div class="answer-pill correct">
                <span>正确答案</span>
                <strong>{{ item.correctAnswer }}</strong>
              </div>
              <div class="answer-pill neutral">
                <span>本题得分</span>
                <strong>{{ item.isCorrect ? item.score : 0 }}/{{ item.score }}</strong>
              </div>
            </div>
            <p class="muted">{{ item.analysis || '暂无解析' }}</p>
          </el-collapse-item>
        </el-collapse>
        <EmptyState v-if="detailList.length === 0" text="暂无答题详情" />
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getResults } from '@/api/results'
import EmptyState from '@/components/EmptyState.vue'
import PageHeader from '@/components/PageHeader.vue'

const rows = ref<any[]>([])
const exam = ref('')
const loading = ref(false)
const detailVisible = ref(false)
const selected = ref<any>()
const detailList = computed(() => selected.value?.detail || [])
async function load() {
  loading.value = true
  try { rows.value = await getResults({ exam: exam.value }) as any[] } finally { loading.value = false }
}
function openDetail(row: any) {
  selected.value = row
  detailVisible.value = true
}
onMounted(load)
</script>
