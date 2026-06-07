<template>
  <div class="countdown" :class="{ danger: remain <= 300 }">
    <el-icon><Clock /></el-icon>
    <span>{{ formatSeconds(remain) }}</span>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { formatSeconds } from '@/utils/format'

const props = defineProps<{ seconds: number; running?: boolean }>()
const emit = defineEmits<{ timeout: [] }>()
const remain = ref(props.seconds)
let timer = 0

function start() {
  window.clearInterval(timer)
  timer = window.setInterval(() => {
    if (props.running === false) return
    remain.value -= 1
    if (remain.value <= 0) {
      remain.value = 0
      window.clearInterval(timer)
      emit('timeout')
    }
  }, 1000)
}

watch(() => props.seconds, (value) => {
  remain.value = value
  start()
})

onMounted(start)
onBeforeUnmount(() => window.clearInterval(timer))
</script>
