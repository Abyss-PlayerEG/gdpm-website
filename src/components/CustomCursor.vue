<template>
  <div
    ref="cursor"
    class="custom-cursor"
    :class="{ hover: isHover, hidden: isZoomed }"
    :style="cursorStyle"
  >
    <div class="cursor-dot"></div>
    <div class="cursor-ring"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const cursor = ref<HTMLElement>()
const isHover = ref(false)
const isZoomed = ref(false)
const cursorStyle = ref<Record<string, string>>({})

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

let lastX = 0
let lastY = 0
let lastTime = 0
let velocityX = 0
let velocityY = 0
let rafId: number | null = null

const handleMouseMove = (e: MouseEvent) => {
  if (!cursor.value || isZoomed.value) return

  const now = performance.now()
  const dt = now - lastTime

  if (dt > 0) {
    velocityX = (e.clientX - lastX) / dt
    velocityY = (e.clientY - lastY) / dt
  }

  lastX = e.clientX
  lastY = e.clientY
  lastTime = now

  cursor.value.style.left = `${e.clientX}px`
  cursor.value.style.top = `${e.clientY}px`

  if (!rafId) {
    rafId = requestAnimationFrame(updateBlur)
  }
}

const updateBlur = () => {
  if (!cursor.value) {
    rafId = null
    return
  }

  const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY)
  const angle = Math.atan2(velocityY, velocityX)

  // Apply directional blur effect
  const blurAmount = Math.min(speed * 2, 8)
  const stretchX = 1 + Math.min(speed * 0.1, 0.5)
  const stretchY = 1 + Math.min(speed * 0.02, 0.1)

  cursorStyle.value = {
    filter: `blur(${blurAmount}px)`,
    transform: `translate(-50%, -50%) rotate(${angle}rad) scaleX(${stretchX}) scaleY(${stretchY})`,
  }

  // Decay velocity
  velocityX *= 0.8
  velocityY *= 0.8

  if (Math.abs(velocityX) > 0.01 || Math.abs(velocityY) > 0.01) {
    rafId = requestAnimationFrame(updateBlur)
  } else {
    cursorStyle.value = {
      filter: 'none',
      transform: 'translate(-50%, -50%)',
    }
    rafId = null
  }
}

const handleMouseDown = () => {
  if (!cursor.value) return
  const ripple = document.createElement('div')
  ripple.className = 'cursor-ripple'
  cursor.value.appendChild(ripple)
  setTimeout(() => ripple.remove(), 600)
}

const checkZoom = () => {
  if (!isSafari) return
  const viewport = window.visualViewport
  if (viewport) {
    const zoomed = viewport.scale > 1.05
    isZoomed.value = zoomed
    document.documentElement.classList.toggle('cursor-zoomed', zoomed)
  }
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
  if (isInteractive(e.target as Element) || (e.target as Element).closest?.('a, button, [role="button"], [data-cursor]')) {
    isHover.value = true
  }
}

const handleMouseOut = (e: MouseEvent) => {
  const related = e.relatedTarget as Element | null
  if (!related || (!isInteractive(related) && !related.closest?.('a, button, [role="button"], [data-cursor]'))) {
    isHover.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseover', handleMouseOver)
  document.addEventListener('mouseout', handleMouseOut)
  document.addEventListener('mousedown', handleMouseDown)

  if (isSafari) {
    window.visualViewport?.addEventListener('scroll', checkZoom)
    window.visualViewport?.addEventListener('resize', checkZoom)
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseover', handleMouseOver)
  document.removeEventListener('mouseout', handleMouseOut)
  document.removeEventListener('mousedown', handleMouseDown)

  if (isSafari) {
    window.visualViewport?.removeEventListener('scroll', checkZoom)
    window.visualViewport?.removeEventListener('resize', checkZoom)
  }

  if (rafId) {
    cancelAnimationFrame(rafId)
  }
})
</script>

<style scoped>
.custom-cursor {
  position: fixed;
  pointer-events: none;
  z-index: 2147483647;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.2s;
}

.custom-cursor.hidden {
  opacity: 0;
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
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
  transition: width 0.2s ease, height 0.2s ease, box-shadow 0.2s ease;
}

.cursor-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid #FFFFFF;
  transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
}

/* Hover state */
.custom-cursor.hover .cursor-dot {
  width: 16px;
  height: 16px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
}

.custom-cursor.hover .cursor-ring {
  width: 64px;
  height: 64px;
  border-color: #FFFFFF;
}

/* Click ripple */
:deep(.cursor-ripple) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-radius: 50%;
  border: 2px solid #FFFFFF;
  animation: clickRipple 0.6s ease-out forwards;
  pointer-events: none;
}

@keyframes clickRipple {
  0% {
    width: 0;
    height: 0;
    opacity: 0.8;
  }
  100% {
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}

@media (pointer: coarse) {
  .custom-cursor {
    display: none;
  }
}
</style>
