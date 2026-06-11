<template>
  <div class="page-content">
    <PageHeader title="创建与发布考试" subtitle="统一维护考试基础信息、发布状态、题目数量和考试规则。" eyebrow="考试管理">
      <template #actions>
        <el-button type="primary" icon="Plus" @click="openDialog()">创建考试</el-button>
      </template>
    </PageHeader>
    <div class="toolbar">
      <div class="filter-bar">
        <el-input v-model="filters.keyword" placeholder="搜索考试名称" clearable prefix-icon="Search" />
        <el-select v-model="filters.status" placeholder="发布状态" clearable>
          <el-option label="已发布" value="published" />
          <el-option label="草稿" value="draft" />
        </el-select>
      </div>
      <div class="toolbar-actions">
        <el-button icon="Refresh" @click="load">刷新数据</el-button>
      </div>
    </div>
    <el-table v-loading="loading" :data="filteredRows" class="pro-table">
      <el-table-column prop="title" label="考试名称" min-width="180" />
      <el-table-column prop="duration" label="时长/分钟" width="110" />
      <el-table-column prop="total_score" label="总分" width="90" />
      <el-table-column prop="question_count" label="题数" width="90" />
      <el-table-column label="随机" width="90"><template #default="{ row }"><el-tag :type="row.is_random ? 'success' : 'info'">{{ row.is_random ? '随机' : '固定' }}</el-tag></template></el-table-column>
      <el-table-column label="发布" width="100"><template #default="{ row }"><el-tag :class="row.is_published ? 'tag-published' : 'tag-draft'">{{ row.is_published ? '已发布' : '未发布' }}</el-tag></template></el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button text icon="Edit" @click="openDialog(row)">编辑</el-button>
          <el-button text :type="row.is_published ? 'warning' : 'primary'" icon="Promotion" @click="togglePublish(row)">
            {{ row.is_published ? '取消发布' : '发布' }}
          </el-button>
          <el-button text type="danger" icon="Delete" @click="remove(row.id)">删除</el-button>
        </template>
      </el-table-column>
      <template #empty><EmptyState text="暂无考试数据" /></template>
    </el-table>
    <el-dialog v-model="visible" :title="form.id ? '编辑考试' : '创建考试'" width="560px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="92px">
        <section class="form-section">
          <h3>基础信息</h3>
          <el-form-item label="考试名称" prop="title"><el-input v-model="form.title" /></el-form-item>
          <el-form-item label="说明"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
        </section>
        <section class="form-section">
          <h3>考试设置</h3>
          <el-form-item label="时长" prop="duration"><el-input-number v-model="form.duration" :min="1" :max="240" /> 分钟</el-form-item>
          <el-form-item label="总分" prop="total_score"><el-input-number v-model="form.total_score" :min="1" :max="300" /></el-form-item>
          <el-form-item label="随机题序"><el-switch v-model="form.is_random" /></el-form-item>
          <el-form-item label="发布状态"><el-switch v-model="form.is_published" /></el-form-item>
        </section>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createExam, deleteExam, getExams, updateExam } from '@/api/exams'
import EmptyState from '@/components/EmptyState.vue'
import PageHeader from '@/components/PageHeader.vue'

const rows = ref<any[]>([])
const loading = ref(false)
const visible = ref(false)
const formRef = ref<FormInstance>()
const filters = reactive({ keyword: '', status: '' })
const form = reactive<any>({ id: null, title: '', description: '', duration: 45, total_score: 100, is_random: false, is_published: true })
const positiveNumber = (_rule: any, value: number, callback: (error?: Error) => void) => {
  if (Number(value) > 0) callback()
  else callback(new Error('必须大于 0'))
}
const rules: FormRules = {
  title: [{ required: true, whitespace: true, message: '考试标题不能为空', trigger: 'blur' }],
  duration: [{ validator: positiveNumber, trigger: 'change' }],
  total_score: [{ validator: positiveNumber, trigger: 'change' }]
}
const filteredRows = computed(() => rows.value.filter((row) => {
  const matchKeyword = !filters.keyword || row.title.includes(filters.keyword)
  const matchStatus = !filters.status || (filters.status === 'published' ? row.is_published : !row.is_published)
  return matchKeyword && matchStatus
}))

async function load() {
  loading.value = true
  try { rows.value = await getExams() as any[] } finally { loading.value = false }
}
function openDialog(row?: any) {
  Object.assign(form, row || { id: null, title: '', description: '', duration: 45, total_score: 100, is_random: false, is_published: true })
  visible.value = true
  nextTick(() => formRef.value?.clearValidate())
}
async function save() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) {
    ElMessage.warning('请先完善考试表单')
    return
  }
  if (form.id) await updateExam(form.id, form)
  else await createExam(form)
  ElMessage.success('保存成功')
  visible.value = false
  load()
}
async function togglePublish(row: any) {
  await updateExam(row.id, { ...row, is_published: !row.is_published })
  ElMessage.success(row.is_published ? '已取消发布' : '已发布')
  load()
}
async function remove(id: number) {
  await ElMessageBox.confirm('删除考试会同时删除关联题目，确认继续？', '提示', { type: 'warning' })
  await deleteExam(id)
  ElMessage.success('删除成功')
  load()
}
onMounted(load)
</script>
