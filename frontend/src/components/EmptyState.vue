<template>
  <div class="empty-state">
    <el-icon><DocumentRemove /></el-icon>
    <p>{{ text || '暂无数据' }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ text?: string }>()
</script>
