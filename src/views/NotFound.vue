<template>
  <section class="not-found">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <p class="error-message">{{ t('notFound.message') }}</p>
      <div v-if="!noRedirect" class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <router-link to="/" class="back-link">{{ t('notFound.goHome') }}</router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  noRedirect?: boolean
}>()

const { t } = useI18n()
const router = useRouter()
const progress = ref(0)
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  const startProgress = () => {
    const duration = 3000 // 3 seconds
    const interval = 30 // update every 30ms
    const increment = (interval / duration) * 100

    timer = setInterval(() => {
      progress.value += increment
      if (progress.value >= 100) {
        progress.value = 100
        clearInterval(timer)
        if (!props.noRedirect) {
          router.push('/')
        }
      }
    }, interval)
  }

  if (document.readyState === 'complete') {
    startProgress()
  } else {
    window.addEventListener('load', startProgress, { once: true })
  }
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0B1120;
  text-align: center;
}

.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.error-code {
  font-size: 120px;
  font-weight: 800;
  color: #478CBF;
  line-height: 1;
  margin: 0;
}

.error-message {
  font-size: 20px;
  color: #94A3B8;
  margin: 0;
}

.progress-bar {
  width: 200px;
  height: 4px;
  border-radius: 2px;
  background: rgba(71, 140, 191, 0.2);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  background: #478CBF;
  transition: width 0.03s linear;
}

.back-link {
  margin-top: 8px;
  padding: 10px 24px;
  border-radius: 8px;
  background: #478CBF;
  color: #FFFFFF;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.back-link:hover {
  background: #5A9FD4;
}
</style>
