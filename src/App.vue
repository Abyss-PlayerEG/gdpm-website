<template>
  <div id="app">
    <Header />

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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'
import FullPageScroll from './components/FullPageScroll.vue'
import Hero from './components/Hero.vue'
import Features from './components/Features.vue'
import QuickStart from './components/QuickStart.vue'
import Versions from './components/Versions.vue'
import Community from './components/Community.vue'

const route = useRoute()
const scroller = ref<InstanceType<typeof FullPageScroll>>()

const isHome = computed(() => route.path === '/')

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
}

/* Only hide overflow on home page */
</style>
