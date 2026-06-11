<template>
  <header class="page-header">
    <div>
      <div v-if="eyebrow" class="page-header-eyebrow">{{ eyebrow }}</div>
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="page-header-actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle: string; eyebrow?: string }>()
</script>
