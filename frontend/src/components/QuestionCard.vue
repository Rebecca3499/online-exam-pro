<template>
  <div class="question-card" :id="`question-${question.id}`">
    <div class="question-head">
      <div class="question-index">第 {{ index + 1 }} 题</div>
      <el-tag :class="question.type === 'single' ? 'tag-single' : 'tag-judge'">{{ question.type === 'single' ? '单选题' : '判断题' }}</el-tag>
      <el-tag type="warning">{{ question.score }} 分</el-tag>
    </div>
    <h3>{{ question.title }}</h3>
    <el-radio-group class="option-list" :model-value="answer" @update:model-value="emit('update:answer', String($event))">
      <el-radio-button v-for="(option, idx) in question.options" :key="option" :label="letters[idx]">
        <strong>{{ letters[idx] }}.</strong> {{ option }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
defineProps<{ question: any; index: number; answer?: string }>()
const emit = defineEmits<{ 'update:answer': [value: string] }>()
const letters = ['A', 'B', 'C', 'D', 'E', 'F']
</script>
