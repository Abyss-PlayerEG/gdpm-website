<template>
  <div ref="cursor" class="custom-cursor" :class="{ hover: isHover }">
    <div class="cursor-dot"></div>
    <div class="cursor-ring"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const cursor = ref<HTMLElement>()
const isHover = ref(false)

const handleMouseMove = (e: MouseEvent) => {
  if (!cursor.value) return
  cursor.value.style.left = `${e.clientX}px`
  cursor.value.style.top = `${e.clientY}px`
}

const isInteractive = (el: Element | null): boolean => {
  if (!el || !(el instanceof HTMLElement)) return false
  const tag = el.tagName.toLowerCase()
  return (
    tag === 'a' ||
    tag === 'button' ||
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    el.getAttribute('role') === 'button' ||
    el.hasAttribute('data-cursor') ||
    el.style.cursor === 'pointer'
  )
}

const handleMouseOver = (e: MouseEvent) => {
  const target = e.target as Element
  if (isInteractive(target) || target.closest('a, button, [role="button"], [data-cursor]')) {
    isHover.value = true
  }
}

const handleMouseOut = (e: MouseEvent) => {
  const related = e.relatedTarget as Element | null
  if (!related || !isInteractive(related) && !related.closest?.('a, button, [role="button"], [data-cursor]')) {
    isHover.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseover', handleMouseOver)
  document.addEventListener('mouseout', handleMouseOut)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseover', handleMouseOver)
  document.removeEventListener('mouseout', handleMouseOut)
})
</script>

<style scoped>
.custom-cursor {
  position: fixed;
  pointer-events: none;
  z-index: 2147483647;
  transform: translate(-50%, -50%);
  mix-blend-mode: difference;
}

.cursor-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #FFFFFF;
  transition: width 0.2s ease, height 0.2s ease;
}

.cursor-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
}

.custom-cursor.hover .cursor-dot {
  width: 16px;
  height: 16px;
}

.custom-cursor.hover .cursor-ring {
  width: 64px;
  height: 64px;
  border-color: rgba(255, 255, 255, 0.8);
}

@media (pointer: coarse) {
  .custom-cursor {
    display: none;
  }
}
</style>
