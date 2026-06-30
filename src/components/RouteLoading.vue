<template>
  <div v-if="loading" class="route-loading" :class="{ visible: visible }">
    <div class="loading-content">
      <div class="loading-logo">GDPM</div>
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const loading = ref(false)
const visible = ref(false)
const router = useRouter()

onMounted(() => {
  router.beforeEach((to, from, next) => {
    // Skip if same route
    if (to.path === from.path) {
      next()
      return
    }

    loading.value = true

    // Wait for fade-in to complete (300ms)
    setTimeout(() => {
      visible.value = true
    }, 10)

    // Wait for loading screen to fully appear, then navigate
    setTimeout(() => {
      next()
    }, 350)
  })

  router.afterEach(() => {
    // Wait a bit for the new page to render, then fade out
    setTimeout(() => {
      visible.value = false
      setTimeout(() => {
        loading.value = false
      }, 300)
    }, 200)
  })
})

defineExpose({ loading, visible })
</script>

<style scoped>
.route-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: #0B1120;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.route-loading.visible {
  opacity: 1;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.loading-logo {
  font-size: 48px;
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: 0.1em;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(71, 140, 191, 0.2);
  border-top-color: #478CBF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
