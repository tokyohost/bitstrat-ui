<!-- components/workspace/ComponentPanel.vue -->
<template>
  <div class="component-panel">
    <div
      v-for="(comp, index) in availableComponents"
      :key="index"
      class="component-item"
      @click="$emit('add', comp)"
    >
      {{ comp.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  availableComponents: { name: string; component: Component }[]
}>()

defineEmits(['add'])
</script>

<style scoped>
.component-panel {
  background-color: #fff;
  padding: 12px;
  height: 100%;
}

.component-item {
  padding: 8px 12px;
  margin-bottom: 8px;
  background-color: #f0f2f5;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.component-item:hover {
  background-color: #dbeafe;
}
</style>
