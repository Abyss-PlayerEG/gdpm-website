<template>
  <div ref="container" class="fullpage">
    <section
      v-for="section in sections"
      :key="section.id"
      class="fullpage-section"
    >
      <slot :name="section.id" />
    </section>

    <nav class="fullpage-nav">
      <button
        v-for="(section, index) in sections"
        :key="section.id"
        class="nav-dot"
        :class="{ active: activeIndex === index }"
        :style="getDotStyle(index)"
        @click="scrollTo(index)"
      />
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Section {
  id: string
}

const props = defineProps<{
  sections: Section[]
}>()

const activeIndex = ref(0)
const scrollProgress = ref(0)
const container = ref<HTMLElement>()

let isScrolling = false

const getDotStyle = (index: number) => {
  const progress = scrollProgress.value
  const current = activeIndex.value

  // Current dot - fade out as scrolling away
  if (index === current) {
    const opacity = 1 - (progress % 1)
    const scale = 1.2 - 0.2 * (progress % 1)
    return {
      opacity: Math.max(0.3, opacity),
      transform: `scale(${Math.max(1, scale)})`,
      background: opacity > 0.5 ? '#478CBF' : 'transparent',
      borderColor: '#478CBF',
    }
  }

  // Next dot - fade in as scrolling towards it
  if (index === current + 1 && progress % 1 > 0) {
    const opacity = progress % 1
    const scale = 1 + 0.2 * (progress % 1)
    return {
      opacity: Math.max(0.3, opacity),
      transform: `scale(${Math.max(1, scale)})`,
      background: opacity > 0.5 ? '#478CBF' : 'transparent',
      borderColor: '#478CBF',
    }
  }

  // Previous dot - fade in when scrolling back
  if (index === current - 1 && progress % 1 < 0) {
    const opacity = Math.abs(progress % 1)
    const scale = 1 + 0.2 * Math.abs(progress % 1)
    return {
      opacity: Math.max(0.3, opacity),
      transform: `scale(${Math.max(1, scale)})`,
      background: opacity > 0.5 ? '#478CBF' : 'transparent',
      borderColor: '#478CBF',
    }
  }

  // Inactive dots
  return {
    opacity: 0.3,
    transform: 'scale(1)',
    background: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  }
}

const handleScroll = () => {
  if (!container.value) return

  const scrollTop = container.value.scrollTop
  const height = container.value.clientHeight
  const rawProgress = scrollTop / height

  activeIndex.value = Math.floor(rawProgress)
  scrollProgress.value = rawProgress

  // Remove hash from URL
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname)
  }
}

const scrollTo = (index: number) => {
  if (!container.value || isScrolling) return
  if (index < 0 || index >= props.sections.length) return

  isScrolling = true
  const height = container.value.clientHeight

  container.value.scrollTo({
    top: height * index,
    behavior: 'smooth',
  })

  activeIndex.value = index
  scrollProgress.value = index

  setTimeout(() => {
    isScrolling = false
  }, 600)
}

const scrollToSection = (sectionId: string) => {
  const index = props.sections.findIndex(s => s.id === sectionId)
  if (index !== -1) {
    scrollTo(index)
  }
}

onMounted(() => {
  if (!container.value) return

  container.value.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  container.value?.removeEventListener('scroll', handleScroll)
})

defineExpose({ scrollTo, scrollToSection, activeIndex, scrollProgress })
</script>

<style scoped>
.fullpage {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.fullpage-section {
  height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  overflow: hidden;
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
  transition: opacity 0.15s ease, transform 0.15s ease, background 0.15s ease;
  padding: 0;
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
