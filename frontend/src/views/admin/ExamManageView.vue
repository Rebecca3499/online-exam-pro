<template>
  <div>
    <div class="page-title">
      <div><h1>考试管理</h1><p>创建、发布并维护考试基础设置</p></div>
      <el-button type="primary" icon="Plus" @click="openDialog()">创建考试</el-button>
    </div>
    <el-table v-loading="loading" :data="rows" class="pro-table">
      <el-table-column prop="title" label="考试名称" min-width="180" />
      <el-table-column prop="duration" label="时长/分钟" width="110" />
      <el-table-column prop="total_score" label="总分" width="90" />
      <el-table-column prop="question_count" label="题数" width="90" />
      <el-table-column label="随机" width="90"><template #default="{ row }"><el-tag :type="row.is_random ? 'success' : 'info'">{{ row.is_random ? '是' : '否' }}</el-tag></template></el-table-column>
      <el-table-column label="发布" width="90"><template #default="{ row }"><el-tag :type="row.is_published ? 'primary' : 'info'">{{ row.is_published ? '已发布' : '草稿' }}</el-tag></template></el-table-column>
      <el-table-column label="操作" width="170" fixed="right">
        <template #default="{ row }">
          <el-button text icon="Edit" @click="openDialog(row)">编辑</el-button>
          <el-button text type="danger" icon="Delete" @click="remove(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="visible" :title="form.id ? '编辑考试' : '创建考试'" width="560px">
      <el-form :model="form" label-width="92px">
        <el-form-item label="考试名称"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="说明"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="时长"><el-input-number v-model="form.duration" :min="5" :max="240" /> 分钟</el-form-item>
        <el-form-item label="总分"><el-input-number v-model="form.total_score" :min="1" :max="300" /></el-form-item>
        <el-form-item label="随机题序"><el-switch v-model="form.is_random" /></el-form-item>
        <el-form-item label="发布状态"><el-switch v-model="form.is_published" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createExam, deleteExam, getExams, updateExam } from '@/api/exams'

const rows = ref<any[]>([])
const loading = ref(false)
const visible = ref(false)
const form = reactive<any>({ id: null, title: '', description: '', duration: 45, total_score: 100, is_random: false, is_published: true })

async function load() {
  loading.value = true
  try { rows.value = await getExams() as any[] } finally { loading.value = false }
}
function openDialog(row?: any) {
  Object.assign(form, row || { id: null, title: '', description: '', duration: 45, total_score: 100, is_random: false, is_published: true })
  visible.value = true
}
async function save() {
  if (form.id) await updateExam(form.id, form)
  else await createExam(form)
  ElMessage.success('保存成功')
  visible.value = false
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
