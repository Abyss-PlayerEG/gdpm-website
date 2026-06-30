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

      <div v-else class="versions-grid">
        <!-- Stable versions -->
        <div class="versions-column">
          <div class="column-header">
            <Icon icon="ri:checkbox-circle-fill" width="18" height="18" class="icon-stable" />
            <span>Stable</span>
          </div>
          <div class="version-list">
            <router-link
              v-for="(version, index) in stableVersions"
              :key="version"
              :to="`/download/${version}`"
              class="version-row"
            >
              <div class="version-info">
                <span class="version-tag">v{{ version }}</span>
                <span v-if="index === 0" class="version-badge badge-latest">Latest</span>
              </div>
              <Icon icon="ri:arrow-right-s-line" width="16" height="16" class="version-arrow" />
            </router-link>
            <div v-if="!stableVersions.length" class="empty">No stable releases</div>
          </div>
        </div>

        <!-- Pre-release versions -->
        <div class="versions-column">
          <div class="column-header">
            <Icon icon="ri:flask-fill" width="18" height="18" class="icon-pre" />
            <span>Pre-release</span>
          </div>
          <div class="version-list">
            <router-link
              v-for="(version, index) in preReleaseVersions"
              :key="version"
              :to="`/download/${version}`"
              class="version-row"
            >
              <div class="version-info">
                <span class="version-tag">v{{ version }}</span>
                <span v-if="index === 0" class="version-badge badge-pre">Pre-release</span>
              </div>
              <Icon icon="ri:arrow-right-s-line" width="16" height="16" class="version-arrow" />
            </router-link>
            <div v-if="!preReleaseVersions.length" class="empty">No pre-releases</div>
          </div>
        </div>
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

const stableVersions = computed(() =>
  versions.value.filter(v => getVersionType(v) === 'stable')
)

const preReleaseVersions = computed(() =>
  versions.value.filter(v => getVersionType(v) !== 'stable')
)
</script>

<style scoped>
.versions-page {
  min-height: 100vh;
  padding: 100px 2rem 60px;
  background: #0B1120;
}

.versions-content {
  max-width: 900px;
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

.versions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.versions-column {
  background: rgba(30, 41, 59, 0.3);
  border: 1px solid rgba(51, 65, 85, 0.3);
  border-radius: 16px;
  overflow: hidden;
}

.column-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(51, 65, 85, 0.3);
  font-size: 15px;
  font-weight: 600;
  color: #FFFFFF;
}

.icon-stable {
  color: #48BB78;
}

.icon-pre {
  color: #ED8936;
}

.version-list {
  padding: 8px;
  max-height: 600px;
  overflow-y: auto;
}

.version-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.version-row:hover {
  background: rgba(71, 140, 191, 0.1);
}

.version-tag {
  font-family: 'JetBrains Mono Nerd Font', monospace;
  font-size: 14px;
  color: #E2E8F0;
}

.version-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.version-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
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

.version-arrow {
  color: #475569;
  transition: color 0.2s;
}

.version-row:hover .version-arrow {
  color: #94A3B8;
}

.empty {
  padding: 24px;
  text-align: center;
  color: #475569;
  font-size: 14px;
}

@media (max-width: 640px) {
  .page-title {
    font-size: 28px;
  }
  .versions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
