<template>
  <div ref="container" class="fullpage">
    <section
      v-for="(section, index) in sections"
      :key="section.id"
      class="fullpage-section"
      :class="{ 'is-active': activeIndex === index }"
    >
      <slot :name="section.id" />
    </section>

    <nav class="fullpage-nav">
      <button
        v-for="(section, index) in sections"
        :key="section.id"
        class="nav-dot"
        :class="{ active: activeIndex === index }"
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
const container = ref<HTMLElement>()

let isScrolling = false
let scrollTimeout: ReturnType<typeof setTimeout>

const handleScroll = () => {
  if (!container.value || isScrolling) return

  clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    if (!container.value) return

    const scrollTop = container.value.scrollTop
    const height = container.value.clientHeight
    const index = Math.round(scrollTop / height)

    if (index !== activeIndex.value) {
      activeIndex.value = index
    }

    // Remove hash from URL
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname)
    }
  }, 50)
}

const scrollTo = (index: number) => {
  if (!container.value || isScrolling) return

  isScrolling = true
  const height = container.value.clientHeight

  container.value.scrollTo({
    top: height * index,
    behavior: 'smooth',
  })

  activeIndex.value = index

  setTimeout(() => {
    isScrolling = false
  }, 800)
}

const scrollToSection = (sectionId: string) => {
  const index = props.sections.findIndex(s => s.id === sectionId)
  if (index !== -1) {
    scrollTo(index)
  }
}

onMounted(() => {
  container.value?.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  container.value?.removeEventListener('scroll', handleScroll)
  clearTimeout(scrollTimeout)
})

defineExpose({ scrollTo, scrollToSection, activeIndex })
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
  right: 24px;
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
  transition: all 0.3s ease;
  padding: 0;
}

.nav-dot:hover {
  border-color: rgba(255, 255, 255, 0.7);
}

.nav-dot.active {
  background: #478CBF;
  border-color: #478CBF;
  transform: scale(1.2);
}
</style>
