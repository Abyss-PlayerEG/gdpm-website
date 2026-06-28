<template>
  <section class="versions-page">
    <div class="versions-content">
      <router-link to="/" class="back-link">
        <Icon icon="ri:arrow-left-line" width="16" height="16" />
        {{ t('versions.back') }}
      </router-link>

      <h1 class="page-title">{{ t('versions.allTitle') }}</h1>
      <p class="page-subtitle">{{ t('versions.allSubtitle') }}</p>

      <div v-if="loading" class="loading">
        <Icon icon="ri:loader-4-line" width="32" height="32" class="spin" />
      </div>

      <div v-else-if="error" class="error">
        <Icon icon="ri:error-warning-fill" width="48" height="48" />
        <p>{{ t('versions.error') }}</p>
        <button @click="refresh" class="retry-btn">{{ t('versions.retry') }}</button>
      </div>

      <div v-else class="versions-list">
        <router-link
          v-for="(version, index) in versions"
          :key="version"
          :to="`/download/${version}`"
          class="version-row"
        >
          <div class="version-info">
            <span class="version-tag">v{{ version }}</span>
            <div class="version-badges">
              <span v-if="isLatestStable(version, index)" class="version-badge badge-latest">Latest</span>
              <span v-else-if="isPreRelease(version)" class="version-badge badge-prerelease">Pre-release</span>
            </div>
          </div>
          <Icon icon="ri:arrow-right-s-line" width="20" height="20" class="version-arrow" />
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useGitHubReleases } from '../composables/useGitHubReleases'
import { getVersionType } from '../utils/version'

const { t } = useI18n()
const { versions, loading, error, refresh } = useGitHubReleases()

function isLatestStable(version: string, index: number): boolean {
  if (getVersionType(version) !== 'stable') return false
  for (let i = 0; i < index; i++) {
    if (getVersionType(versions.value[i]) === 'stable') return false
  }
  return true
}

function isPreRelease(version: string): boolean {
  return getVersionType(version) !== 'stable'
}
</script>

<style scoped>
.versions-page {
  min-height: 100vh;
  padding: 100px 2rem 60px;
}

.versions-content {
  max-width: 700px;
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #94A3B8;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 32px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #FFFFFF;
}

.page-title {
  font-size: 40px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 18px;
  color: #64748B;
  margin-bottom: 48px;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 80px 0;
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
  padding: 80px 0;
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

.versions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.version-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(30, 41, 59, 0.3) 100%);
  border: 1px solid rgba(51, 65, 85, 0.3);
  text-decoration: none;
  transition: all 0.2s;
}

.version-row:hover {
  border-color: rgba(71, 140, 191, 0.4);
  background: linear-gradient(135deg, rgba(71, 140, 191, 0.1) 0%, rgba(71, 140, 191, 0.05) 100%);
}

.version-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.version-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  font-weight: 500;
  color: #FFFFFF;
}

.version-badges {
  display: flex;
  gap: 8px;
}

.version-badge {
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.badge-latest {
  background: rgba(71, 140, 191, 0.2);
  color: #478CBF;
}

.badge-prerelease {
  background: rgba(237, 137, 54, 0.2);
  color: #ED8936;
}

.version-arrow {
  color: #475569;
  transition: color 0.2s;
}

.version-row:hover .version-arrow {
  color: #94A3B8;
}

@media (max-width: 640px) {
  .page-title {
    font-size: 32px;
  }
}
</style>
