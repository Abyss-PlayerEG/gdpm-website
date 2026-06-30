<template>
  <div id="app">
    <CircleTransition />
    <div class="bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>
    <div class="mobile-orb"></div>
    <Header v-if="showHeader" />

    <!-- Home page with full-page scroll -->
    <template v-if="isHome">
      <FullPageScroll ref="scroller" :sections="sections">
        <template #hero>
          <Hero @scroll-to="scrollToSection" />
        </template>
        <template #features>
          <Features />
        </template>
        <template #quickstart>
          <QuickStart />
        </template>
        <template #versions>
          <Versions />
        </template>
        <template #community>
          <Community />
        </template>
      </FullPageScroll>
    </template>

    <!-- Other pages -->
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'
import CircleTransition from './components/CircleTransition.vue'
import FullPageScroll from './components/FullPageScroll.vue'
import Hero from './components/Hero.vue'
import Features from './components/Features.vue'
import QuickStart from './components/QuickStart.vue'
import Versions from './components/Versions.vue'
import Community from './components/Community.vue'

const route = useRoute()
const scroller = ref<InstanceType<typeof FullPageScroll>>()

const isHome = computed(() => route.path === '/')
const showHeader = computed(() => route.name !== 'not-found' && route.name !== 'dev-404')

const sections = [
  { id: 'hero' },
  { id: 'features' },
  { id: 'quickstart' },
  { id: 'versions' },
  { id: 'community' },
]

const scrollToSection = (sectionId: string) => {
  scroller.value?.scrollToSection(sectionId)
}

// Animate orbs based on scroll progress
watch(
  () => scroller.value?.scrollProgress,
  (progress) => {
    if (progress === undefined) return

    const orb1 = document.querySelector('.orb-1') as HTMLElement
    const orb2 = document.querySelector('.orb-2') as HTMLElement
    if (!orb1 || !orb2) return

    const sectionProgress = progress % 1
    const currentIndex = Math.floor(progress)

    // Positions for each section boundary
    const corners = [
      { top: '-5%', left: '-5%' },      // top-left
      { top: '75%', left: '-5%' },       // bottom-left
      { top: '75%', left: '75%' },       // bottom-right
      { top: '-5%', left: '75%' },       // top-right
      { top: '-5%', left: '-5%' },       // back to top-left
    ]

    // Interpolate between current and next corner
    const from = corners[Math.min(currentIndex, corners.length - 1)]
    const to = corners[Math.min(currentIndex + 1, corners.length - 1)]

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const fromTop = parseFloat(from.top)
    const fromLeft = parseFloat(from.left)
    const toTop = parseFloat(to.top)
    const toLeft = parseFloat(to.left)

    const orb1Top = lerp(fromTop, toTop, sectionProgress)
    const orb1Left = lerp(fromLeft, toLeft, sectionProgress)

    // orb2 mirrors orb1 (opposite corners)
    const orb2Bottom = lerp(fromTop, toTop, sectionProgress)
    const orb2Right = lerp(fromLeft, toLeft, sectionProgress)

    orb1.style.top = `${orb1Top}%`
    orb1.style.left = `${orb1Left}%`
    orb2.style.bottom = `${orb2Bottom}%`
    orb2.style.right = `${orb2Right}%`
  }
)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

#app {
  height: 100%;
  position: relative;
}

.bg-orbs {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  will-change: top, left, bottom, right;
}

.orb-1 {
  width: 500px;
  height: 500px;
  top: -5%;
  left: -5%;
  background: radial-gradient(circle, rgba(71, 140, 191, 0.3) 0%, transparent 70%);
}

.orb-2 {
  width: 400px;
  height: 400px;
  bottom: -5%;
  right: -5%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
}

.mobile-orb {
  display: none;
}

@media (max-width: 640px) {
  .bg-orbs {
    display: none;
  }
  .mobile-orb {
    display: block;
    position: fixed;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(71, 140, 191, 0.3) 0%, transparent 70%);
    filter: blur(60px);
    pointer-events: none;
    z-index: 0;
  }
}
</style>
