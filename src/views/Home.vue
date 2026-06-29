<template>
  <div class="home">
    <Hero />
    <Features />
    <QuickStart />
    <Versions />
    <Community />
  </div>
</template>

<script setup lang="ts">
import Hero from '../components/Hero.vue'
import Features from '../components/Features.vue'
import QuickStart from '../components/QuickStart.vue'
import Versions from '../components/Versions.vue'
import Community from '../components/Community.vue'
</script>

<style scoped>
.home {
  flex: 1;
}
</style>
