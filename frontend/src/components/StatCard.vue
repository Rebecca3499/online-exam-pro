<template>
  <div class="stat-card">
    <div class="stat-icon">
      <el-icon><component :is="icon" /></el-icon>
    </div>
    <div>
      <p>{{ label }}</p>
      <strong>{{ value }}</strong>
      <small v-if="description">{{ description }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string | number; icon: string; description?: string }>()
</script>
