<template>
  <div class="stat-card">
    <div class="stat-icon">
      <el-icon><component :is="icon" /></el-icon>
    </div>
    <div>
      <p>{{ label }}</p>
      <strong>{{ value }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string | number; icon: string }>()
</script>
