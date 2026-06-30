<template>
  <button class="copy-btn" @click="handleCopy">
    <span class="copy-icon" :class="{ copied }">
      <Icon icon="ri:file-copy-line" :width="size" :height="size" />
    </span>
    <span class="check-icon" :class="{ copied }">
      <Icon icon="ri:check-line" :width="size" :height="size" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps<{
  text: string
  size?: number
}>()

const copied = ref(false)

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch {
    // Fallback for mobile browsers
    const textarea = document.createElement('textarea')
    textarea.value = props.text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  }
}
</script>

<style scoped>
.copy-btn {
  position: relative;
  padding: 4px;
  border-radius: 4px;
  background: transparent;
  border: none;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s;
  width: fit-content;
}

.copy-btn:hover {
  color: #478CBF;
  background: rgba(71, 140, 191, 0.1);
}

.copy-icon,
.check-icon {
  display: inline-flex;
  transition: opacity 0.2s;
}

.copy-icon {
  opacity: 1;
}

.check-icon {
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #48BB78;
}

.copy-icon.copied {
  opacity: 0;
}

.check-icon.copied {
  opacity: 1;
}
</style>
