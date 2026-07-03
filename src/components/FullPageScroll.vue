<template>
  <div ref="container" class="fullpage">
    <div
      ref="wrapper"
      class="fullpage-wrapper"
      :style="wrapperStyle"
    >
      <section
        v-for="section in sections"
        :key="section.id"
        class="fullpage-section"
      >
        <slot :name="section.id" />
      </section>
    </div>

    <nav class="fullpage-nav">
      <button
        v-for="(section, index) in sections"
        :key="section.id"
        class="nav-dot"
        :class="{ active: currentIndex === index }"
        @click="scrollTo(index)"
      />
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Section {
  id: string
}

interface Props {
  sections: Section[]
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 600,
})

const currentIndex = ref(0)
const scrollProgress = ref(0)
const container = ref<HTMLElement>()

let isAnimating = false
let startY = 0
let currentY = 0
let isDragging = false
let animationFrame: number | null = null
let animateStartTime = 0
let animateFrom = 0
let animateTo = 0
let lastScrollTime = 0

const COOLDOWN = 800

const wrapperStyle = computed(() => ({
  transform: `translate3d(0, ${-scrollProgress.value * 100}vh, 0)`,
  transition: isAnimating ? 'none' : 'none',
}))

const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3)
}

const animateScroll = (timestamp: number) => {
  if (!animateStartTime) animateStartTime = timestamp

  const elapsed = timestamp - animateStartTime
  const progress = Math.min(elapsed / props.duration, 1)
  const easedProgress = easeOutCubic(progress)

  scrollProgress.value = animateFrom + (animateTo - animateFrom) * easedProgress

  if (progress < 1) {
    animationFrame = requestAnimationFrame(animateScroll)
  } else {
    isAnimating = false
    animateStartTime = 0
    animationFrame = null
  }
}

const scrollTo = (index: number) => {
  if (index < 0 || index >= props.sections.length || index === currentIndex.value) return

  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }

  isAnimating = true
  animateFrom = scrollProgress.value
  animateTo = index
  currentIndex.value = index

  animationFrame = requestAnimationFrame(animateScroll)
}

const scrollToSection = (sectionId: string) => {
  const index = props.sections.findIndex(s => s.id === sectionId)
  if (index !== -1) {
    scrollTo(index)
  }
}

const handleWheel = (e: WheelEvent) => {
  e.preventDefault()

  const now = Date.now()
  if (now - lastScrollTime < COOLDOWN) return

  const delta = e.deltaY
  if (Math.abs(delta) < 10) return

  lastScrollTime = now

  if (delta > 0) {
    scrollTo(currentIndex.value + 1)
  } else {
    scrollTo(currentIndex.value - 1)
  }
}

const handleTouchStart = (e: TouchEvent) => {
  if (isAnimating) return
  startY = e.touches[0].clientY
  isDragging = true
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging) return
  e.preventDefault()
  currentY = e.touches[0].clientY
}

const handleTouchEnd = () => {
  if (!isDragging) return
  isDragging = false

  const delta = startY - currentY
  if (Math.abs(delta) > 50) {
    if (delta > 0) {
      scrollTo(currentIndex.value + 1)
    } else {
      scrollTo(currentIndex.value - 1)
    }
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (isAnimating) return

  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault()
    scrollTo(currentIndex.value + 1)
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault()
    scrollTo(currentIndex.value - 1)
  }
}

onMounted(() => {
  if (!container.value) return

  container.value.addEventListener('wheel', handleWheel, { passive: false })
  container.value.addEventListener('touchstart', handleTouchStart, { passive: true })
  container.value.addEventListener('touchmove', handleTouchMove, { passive: false })
  container.value.addEventListener('touchend', handleTouchEnd, { passive: true })
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  container.value?.removeEventListener('wheel', handleWheel)
  container.value?.removeEventListener('touchstart', handleTouchStart)
  container.value?.removeEventListener('touchmove', handleTouchMove)
  container.value?.removeEventListener('touchend', handleTouchEnd)
  document.removeEventListener('keydown', handleKeydown)
})

defineExpose({ scrollTo, scrollToSection, currentIndex, scrollProgress })
</script>

<style scoped>
.fullpage {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.fullpage-wrapper {
  width: 100%;
  height: 100%;
  will-change: transform;
}

.fullpage-section {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: transparent;
}

.fullpage-nav {
  position: fixed;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 100;
}

.nav-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  cursor: pointer;
  transition: opacity 0.3s ease, transform 0.3s ease, background 0.3s ease;
  padding: 0;
}

.nav-dot.active {
  background: #478CBF;
  border-color: #478CBF;
  transform: scale(1.2);
}

.nav-dot:hover {
  border-color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 640px) {
  .fullpage-nav {
    right: 8px;
    gap: 8px;
  }
  .nav-dot {
    width: 8px;
    height: 8px;
  }
}
</style>
