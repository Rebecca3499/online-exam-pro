<template>
  <div class="take-page" v-if="exam">
    <aside class="answer-sheet">
      <h3>答题卡</h3>
      <div class="sheet-grid">
        <button v-for="(q, i) in exam.questions" :key="q.id" :class="{ done: answers[q.id] }" @click="scrollTo(q.id)">{{ i + 1 }}</button>
      </div>
      <div class="risk-box">
        <span>切屏次数</span>
        <strong>{{ switchCount }}</strong>
      </div>
    </aside>
    <main class="exam-paper">
      <div class="paper-header">
        <div>
          <h1>{{ exam.title }}</h1>
          <p>已自动保存 {{ answeredCount }}/{{ exam.questions.length }} 题</p>
        </div>
        <CountdownTimer :seconds="exam.duration * 60" @timeout="autoSubmit" />
      </div>
      <QuestionCard v-for="(q, i) in exam.questions" :key="q.id" :question="q" :index="i" :answer="answers[q.id]" @update:answer="setAnswer(q.id, $event)" />
      <div class="submit-bar">
        <el-button size="large" @click="$router.push('/student/exams')">返回列表</el-button>
        <el-button type="primary" size="large" icon="Check" :loading="submitting" @click="confirmSubmit">提交试卷</el-button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import CountdownTimer from '@/components/CountdownTimer.vue'
import QuestionCard from '@/components/QuestionCard.vue'
import { getExam, submitExam } from '@/api/exams'
import { useAuthStore } from '@/stores/auth'
import { examDraftKey, getStorage, removeStorage, setStorage } from '@/utils/storage'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const exam = ref<any>()
const answers = reactive<Record<string, string>>({})
const switchCount = ref(0)
const submitting = ref(false)
const startAt = Date.now()
const submitted = ref(false)
let lastSwitchAt = 0
const answeredCount = computed(() => Object.values(answers).filter(Boolean).length)

function draftKey() {
  return examDraftKey(route.params.id as string, auth.user?.id || 'guest')
}
function persist() {
  setStorage(draftKey(), { answers, switchCount: switchCount.value })
}
function setAnswer(id: number, value: string) {
  answers[String(id)] = value
  persist()
}
function scrollTo(id: number) {
  document.getElementById(`question-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function markSwitch() {
  if (submitted.value) return
  const now = Date.now()
  if (now - lastSwitchAt < 800) return
  lastSwitchAt = now
  switchCount.value += 1
  persist()
  ElMessage.warning(`检测到切屏，当前次数 ${switchCount.value}`)
}
function handleVisibilityChange() {
  if (document.hidden) markSwitch()
}
async function doSubmit(isTimeout = false) {
  if (submitted.value) return
  submitted.value = true
  submitting.value = true
  try {
    const data: any = await submitExam({
      exam_id: Number(route.params.id),
      answers,
      duration_used: Math.floor((Date.now() - startAt) / 1000),
      switch_count: switchCount.value,
      is_timeout: isTimeout
    })
    removeStorage(draftKey())
    ElMessage.success('提交成功，正在生成成绩')
    router.replace(`/student/results/${data.id}`)
  } finally {
    submitting.value = false
  }
}
async function confirmSubmit() {
  await ElMessageBox.confirm(`已作答 ${answeredCount.value}/${exam.value.questions.length} 题，确认提交？`, '提交确认', { type: 'warning' })
  doSubmit(false)
}
function autoSubmit() {
  ElMessage.warning('考试时间已到，系统自动提交')
  doSubmit(true)
}
onMounted(async () => {
  exam.value = await getExam(route.params.id as string)
  const draft = getStorage<any>(draftKey(), { answers: {}, switchCount: 0 })
  Object.assign(answers, draft.answers || {})
  switchCount.value = draft.switchCount || 0
  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('blur', markSwitch)
})
onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('blur', markSwitch)
})
</script>
