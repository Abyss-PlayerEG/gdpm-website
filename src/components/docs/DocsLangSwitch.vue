<template>
  <div class="docs-lang-switch">
    <button
      v-for="language in languages"
      :key="language.folder"
      type="button"
      :class="{ active: language.folder === current }"
      @click="emit('select', language.folder)"
    >
      {{ language.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { DocsLanguage } from '../../utils/docs'

defineProps<{
  languages: DocsLanguage[]
  current: string
}>()

const emit = defineEmits<{ select: [folder: string] }>()
</script>

<style scoped>
.docs-lang-switch {
  display: flex;
  padding: 3px;
  border-radius: 6px;
  background: rgba(30, 41, 59, 0.6);
}

.docs-lang-switch button {
  flex: 1;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #94A3B8;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.2s, color 0.2s;
}

.docs-lang-switch button.active {
  background: #478CBF;
  color: #FFFFFF;
}
</style>
