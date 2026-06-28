<template>
  <section class="versions">
    <div class="versions-content">
      <h2 class="section-title">{{ t('versions.title') }}</h2>
      <p class="section-subtitle">{{ t('versions.subtitle') }}</p>

      <div v-if="loading" class="loading">
        <Icon icon="ri:loader-4-line" width="24" height="24" class="spin" />
        {{ t('versions.loading') }}
      </div>

      <div v-else-if="error" class="error">
        <Icon icon="ri:error-warning-fill" width="24" height="24" />
        <p>{{ t('versions.error') }}</p>
        <button @click="refresh" class="retry-btn">{{ t('versions.retry') }}</button>
      </div>

      <div v-else class="versions-preview">
        <div class="version-cards">
          <router-link
            v-if="latestStable"
            :to="`/download/${latestStable}`"
            class="version-card card-latest"
          >
            <span class="card-badge badge-latest">Latest</span>
            <span class="card-version">v{{ latestStable }}</span>
          </router-link>

          <router-link
            v-if="latestPreRelease"
            :to="`/download/${latestPreRelease}`"
            class="version-card card-pre"
          >
            <span class="card-badge badge-pre">Pre-release</span>
            <span class="card-version">v{{ latestPreRelease }}</span>
          </router-link>
        </div>

        <router-link to="/versions" class="view-all-link">
          {{ t('versions.viewAll') }}
          <Icon icon="ri:arrow-right-line" width="16" height="16" />
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useGitHubReleases } from '../composables/useGitHubReleases'
import { getVersionType } from '../utils/version'

const { t } = useI18n()
const { versions, loading, error, refresh } = useGitHubReleases()

const latestStable = computed(() => {
  return versions.value.find(v => getVersionType(v) === 'stable') || ''
})

const latestPreRelease = computed(() => {
  return versions.value.find(v => getVersionType(v) !== 'stable') || ''
})
</script>

<style scoped>
.versions {
  padding: 100px 2rem;
  background: #0F172A;
}

.versions-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.section-title {
  font-size: 40px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 18px;
  color: #64748B;
  margin-bottom: 48px;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 16px;
  color: #94A3B8;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #EF4444;
}

.retry-btn {
  padding: 8px 20px;
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(51, 65, 85, 0.5);
  color: #94A3B8;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  border-color: #478CBF;
  color: #FFFFFF;
}

.versions-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.version-cards {
  display: flex;
  gap: 16px;
}

.version-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 32px;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  min-width: 160px;
}

.card-latest {
  background: linear-gradient(135deg, rgba(71, 140, 191, 0.15) 0%, rgba(71, 140, 191, 0.05) 100%);
  border: 1px solid rgba(71, 140, 191, 0.3);
}

.card-latest:hover {
  border-color: rgba(71, 140, 191, 0.6);
  transform: translateY(-2px);
}

.card-pre {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(30, 41, 59, 0.3) 100%);
  border: 1px solid rgba(51, 65, 85, 0.3);
}

.card-pre:hover {
  border-color: rgba(237, 137, 54, 0.5);
  transform: translateY(-2px);
}

.card-badge {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.badge-latest {
  background: rgba(71, 140, 191, 0.2);
  color: #478CBF;
}

.badge-pre {
  background: rgba(237, 137, 54, 0.2);
  color: #ED8936;
}

.card-version {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
}

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #94A3B8;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.view-all-link:hover {
  color: #FFFFFF;
}

@media (max-width: 480px) {
  .version-cards {
    flex-direction: column;
    width: 100%;
  }
  .version-card {
    min-width: auto;
  }
}
</style>
