<template>
  <div>
    <div class="page-title">
      <div><h1>题目管理</h1><p>支持单选、判断、搜索筛选与 JSON 批量导入</p></div>
      <div class="actions">
        <el-button icon="Download" @click="downloadSample">下载示例 JSON</el-button>
        <el-button icon="Upload" @click="fileInput?.click()">导入题目</el-button>
        <el-button type="primary" icon="Plus" @click="openDialog()">新增题目</el-button>
        <input ref="fileInput" hidden type="file" accept="application/json" @change="handleImport" />
      </div>
    </div>
    <div class="filter-bar">
      <el-input v-model="filters.keyword" placeholder="搜索题干" clearable prefix-icon="Search" />
      <el-select v-model="filters.type" placeholder="题型" clearable>
        <el-option label="单选题" value="single" />
        <el-option label="判断题" value="judge" />
      </el-select>
      <el-button type="primary" icon="Search" @click="load">查询</el-button>
    </div>
    <el-table v-loading="loading" :data="rows" class="pro-table">
      <el-table-column prop="title" label="题干" min-width="260" />
      <el-table-column prop="exam_title" label="所属考试" min-width="160" />
      <el-table-column label="题型" width="100"><template #default="{ row }">{{ row.type === 'single' ? '单选' : '判断' }}</template></el-table-column>
      <el-table-column prop="answer" label="答案" width="80" />
      <el-table-column prop="score" label="分值" width="80" />
      <el-table-column label="操作" width="170" fixed="right">
        <template #default="{ row }">
          <el-button text icon="Edit" @click="openDialog(row)">编辑</el-button>
          <el-button text type="danger" icon="Delete" @click="remove(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="visible" :title="form.id ? '编辑题目' : '新增题目'" width="680px">
      <el-form :model="form" label-width="92px">
        <el-form-item label="所属考试">
          <el-select v-model="form.exam_id" class="full">
            <el-option v-for="exam in exams" :key="exam.id" :label="exam.title" :value="exam.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="题型">
          <el-segmented v-model="form.type" :options="[{ label: '单选题', value: 'single' }, { label: '判断题', value: 'judge' }]" @change="syncType" />
        </el-form-item>
        <el-form-item label="题干"><el-input v-model="form.title" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="选项">
          <div class="option-editor">
            <el-input v-for="(_, idx) in form.options" :key="idx" v-model="form.options[idx]">
              <template #prepend>{{ letters[idx] }}</template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="正确答案">
          <el-select v-model="form.answer">
            <el-option v-for="(_, idx) in form.options" :key="idx" :label="letters[idx]" :value="letters[idx]" />
          </el-select>
        </el-form-item>
        <el-form-item label="分值"><el-input-number v-model="form.score" :min="1" /></el-form-item>
        <el-form-item label="解析"><el-input v-model="form.analysis" type="textarea" :rows="3" /></el-form-item>
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
import { getExams } from '@/api/exams'
import { createQuestion, deleteQuestion, getQuestions, importQuestions, updateQuestion } from '@/api/questions'

const rows = ref<any[]>([])
const exams = ref<any[]>([])
const loading = ref(false)
const visible = ref(false)
const fileInput = ref<HTMLInputElement>()
const filters = reactive({ keyword: '', type: '' })
const letters = ['A', 'B', 'C', 'D']
const form = reactive<any>({ id: null, exam_id: null, type: 'single', title: '', options: ['', '', '', ''], answer: 'A', score: 10, analysis: '' })

async function load() {
  loading.value = true
  try { rows.value = await getQuestions(filters) as any[] } finally { loading.value = false }
}
async function loadExams() { exams.value = await getExams() as any[] }
function syncType() {
  form.options = form.type === 'judge' ? ['正确', '错误'] : ['', '', '', '']
  form.answer = 'A'
}
function openDialog(row?: any) {
  Object.assign(form, row ? { ...row, options: [...row.options] } : { id: null, exam_id: exams.value[0]?.id, type: 'single', title: '', options: ['', '', '', ''], answer: 'A', score: 10, analysis: '' })
  visible.value = true
}
async function save() {
  if (form.id) await updateQuestion(form.id, form)
  else await createQuestion(form)
  ElMessage.success('保存成功')
  visible.value = false
  load()
}
async function remove(id: number) {
  await ElMessageBox.confirm('确认删除该题目？', '提示', { type: 'warning' })
  await deleteQuestion(id)
  ElMessage.success('删除成功')
  load()
}
function downloadSample() {
  const sample = [{ exam_id: exams.value[0]?.id || 1, type: 'single', title: '示例题目', options: ['选项一', '选项二', '选项三', '选项四'], answer: 'A', score: 10, analysis: '这里填写解析。' }]
  const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'questions-sample.json'
  a.click()
  URL.revokeObjectURL(a.href)
}
function handleImport(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async () => {
    const data = JSON.parse(String(reader.result))
    await importQuestions(data)
    ElMessage.success('导入成功')
    load()
  }
  reader.readAsText(file)
}
onMounted(async () => { await loadExams(); await load() })
</script>
