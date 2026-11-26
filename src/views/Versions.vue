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

      <div v-else>
        <div class="filter-bar" role="tablist">
          <button
            v-for="option in filters"
            :key="option.value"
            class="filter-btn"
            :class="{ active: filter === option.value }"
            :aria-selected="filter === option.value"
            role="tab"
            type="button"
            @click="filter = option.value"
          >
            {{ t(option.label) }}
            <span class="filter-count">{{ counts[option.value] }}</span>
          </button>
        </div>

        <div class="version-list">
          <router-link
            v-for="row in filteredRows"
            :key="row.tag"
            :to="`/version/${row.tag}`"
            class="version-row"
          >
            <div class="version-info">
              <span class="version-tag">v{{ row.tag }}</span>
              <span v-if="row.tag === latestTag" class="version-badge badge-latest">Latest</span>
            </div>
            <span class="version-date">{{ row.date }}</span>
            <Icon icon="ri:arrow-right-s-line" width="16" height="16" class="version-arrow" />
          </router-link>
          <div v-if="!filteredRows.length" class="empty">{{ emptyText }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useGitHubReleases } from '../composables/useGitHubReleases'

type Filter = 'all' | 'stable' | 'pre'

const { t } = useI18n()
const { releasesList, latestTag, loading, error, refresh } = useGitHubReleases()

const filter = ref<Filter>('all')

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'versions.filterAll' },
  { value: 'stable', label: 'versions.filterStable' },
  { value: 'pre', label: 'versions.filterPre' },
]

// API returns releases newest-first
const rows = computed(() =>
  releasesList.value.map((release) => ({
    tag: release.tag_name.replace(/^v/, ''),
    date: release.published_at ? release.published_at.slice(0, 10) : '',
    prerelease: release.prerelease,
  }))
)

const counts = computed(() => ({
  all: rows.value.length,
  stable: rows.value.filter((row) => !row.prerelease).length,
  pre: rows.value.filter((row) => row.prerelease).length,
}))

const filteredRows = computed(() => {
  if (filter.value === 'stable') return rows.value.filter((row) => !row.prerelease)
  if (filter.value === 'pre') return rows.value.filter((row) => row.prerelease)
  return rows.value
})

const emptyText = computed(() => {
  if (filter.value === 'stable') return t('versions.emptyStable')
  if (filter.value === 'pre') return t('versions.emptyPre')
  return t('versions.emptyAll')
})
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

.filter-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(30, 41, 59, 0.3);
  border: 1px solid rgba(51, 65, 85, 0.3);
  color: #94A3B8;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: rgba(71, 140, 191, 0.5);
  color: #FFFFFF;
}

.filter-btn.active {
  background: rgba(71, 140, 191, 0.18);
  border-color: #478CBF;
  color: #FFFFFF;
}

.filter-count {
  font-family: 'JetBrains Mono Nerd Font', monospace;
  font-size: 11px;
  color: #64748B;
}

.filter-btn.active .filter-count {
  color: #93C5FD;
}

.version-list {
  background: rgba(30, 41, 59, 0.3);
  border: 1px solid rgba(51, 65, 85, 0.3);
  border-radius: 16px;
  padding: 8px;
  max-height: 600px;
  overflow-y: auto;
}

.version-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
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

.version-date {
  font-family: 'JetBrains Mono Nerd Font', monospace;
  font-size: 13px;
  color: #64748B;
  margin-left: auto;
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

  .page-subtitle {
    font-size: 16px;
    margin-bottom: 32px;
  }

  .version-date {
    display: none;
  }
}
</style>
