<template>
  <div v-if="active" class="circle-transition" :class="{ expanding: expanding, shrinking: shrinking }">
    <div class="circle" :style="circleStyle">
      <div class="transition-content" :class="{ visible: expanding && !shrinking }">
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const active = ref(false)
const expanding = ref(false)
const shrinking = ref(false)
const clickX = ref(window.innerWidth / 2)
const clickY = ref(window.innerHeight / 2)
const router = useRouter()

const circleStyle = computed(() => ({
  left: `${clickX.value}px`,
  top: `${clickY.value}px`,
}))

onMounted(() => {
  router.beforeEach((to, from) => {
    if (to.path === from.path) return

    return new Promise<boolean>((resolve) => {
      active.value = true
      expanding.value = true

      setTimeout(() => {
        resolve(true)
        expanding.value = false
        shrinking.value = true

        setTimeout(() => {
          shrinking.value = false
          active.value = false
        }, 600)
      }, 600)
    })
  })

  document.addEventListener('click', (e) => {
    clickX.value = e.clientX
    clickY.value = e.clientY
  })
})
</script>

<style scoped>
.circle-transition {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  pointer-events: none;
}

.circle {
  position: absolute;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #0B1120 0%, #1A2A3A 100%);
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 0 120px 60px rgba(11, 17, 32, 0.8);
}

.transition-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s;
}

.transition-content.visible {
  opacity: 1;
  transform: scale(1);
}

.transition-logo {
  width: 64px;
  height: 64px;
  border-radius: 14px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(71, 140, 191, 0.2);
  border-top-color: #478CBF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.expanding .circle {
  animation: expand 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.shrinking .circle {
  animation: shrink 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes expand {
  0% { width: 0; height: 0; }
  100% { width: 300vmax; height: 300vmax; }
}

@keyframes shrink {
  0% { width: 300vmax; height: 300vmax; }
  100% { width: 0; height: 0; }
}
</style>
