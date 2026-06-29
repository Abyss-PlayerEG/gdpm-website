<template>
  <section class="download">
    <div class="download-content">
      <router-link to="/" class="back-link">
        <Icon icon="ri:arrow-left-line" width="16" height="16" />
        {{ t('download.back') }}
      </router-link>

      <div v-if="loading" class="loading">
        <Icon icon="ri:loader-4-line" width="32" height="32" class="spin" />
      </div>

      <div v-else-if="error" class="error">
        <Icon icon="ri:error-warning-fill" width="48" height="48" />
        <h2>{{ t('download.notFound') }}</h2>
        <p>{{ t('download.notFoundDesc', { version }) }}</p>
        <router-link to="/" class="btn-primary">{{ t('download.goHome') }}</router-link>
      </div>

      <template v-else>
        <div class="version-header">
          <h1 class="version-title">v{{ version }}</h1>
          <div class="version-badges">
            <span v-if="isLatest" class="version-badge badge-latest">Latest</span>
            <span v-if="release!.prerelease" class="version-badge badge-prerelease">Pre-release</span>
            <span v-for="tag in versionTags" :key="tag" class="version-badge" :class="getBadgeClass(tag)">
              {{ tag.toUpperCase() }}
            </span>
          </div>
          <span class="version-date">{{ formatDate(release!.published_at) }}</span>
        </div>

        <p class="section-title">{{ t('download.downloads') }}</p>

        <div class="assets-grid">
          <a
            v-for="asset in assets"
            :key="asset.name"
            :href="asset.browser_download_url"
            class="asset-card"
          >
            <div class="asset-icon">
              <Icon :icon="getPlatformIcon(asset.name)" width="24" height="24" />
            </div>
            <div class="asset-info">
              <span class="asset-name">{{ getPlatform(asset.name) }}</span>
              <span class="asset-arch">{{ getArch(asset.name) }}</span>
            </div>
            <div class="asset-meta">
              <span class="asset-size">{{ formatSize(asset.size) }}</span>
              <Icon icon="ri:download-2-line" width="16" height="16" />
            </div>
          </a>
        </div>

        <div v-if="assets.some(a => a.digest)" class="checksums-section">
          <p class="section-title">SHA256</p>
          <div class="checksum-list">
            <div v-for="asset in assets" :key="asset.name" class="checksum-item">
              <Icon :icon="getPlatformIcon(asset.name)" width="16" height="16" class="checksum-icon" />
              <span class="checksum-name">{{ asset.name }}</span>
              <div class="checksum-hash">
                <code>{{ asset.digest ? asset.digest.replace('sha256:', '') : '-' }}</code>
                <button
                  v-if="asset.digest"
                  class="copy-btn-sm"
                  @click="copyHash(asset.digest.replace('sha256:', ''), asset.name)"
                >
                  <Icon :icon="copiedHash === asset.name ? 'ri:check-line' : 'ri:file-copy-line'" width="14" height="14" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="install-section">
          <p class="section-title">{{ t('download.install') }}</p>
          <div class="install-code">
            <code>pip install godot-gdpm=={{ version }}</code>
            <button class="copy-btn" @click="copyInstallCommand">
              <Icon :icon="copied ? 'ri:check-line' : 'ri:file-copy-line'" width="16" height="16" />
            </button>
          </div>
        </div>

        <div v-if="release!.body" class="release-notes-section">
          <p class="section-title">{{ t('download.releaseNotes') }}</p>
          <div v-if="!hasTranslation && locale === 'zh'" class="translation-notice">
            {{ t('download.noTranslation') }}
          </div>
          <div class="release-notes markdown-body" v-html="renderedNotes"></div>
        </div>

        <div class="links">
          <a :href="release!.html_url" target="_blank" class="github-link">
            <Icon icon="ri:github-fill" width="16" height="16" />
            {{ t('download.viewOnGitHub') }}
          </a>
          <a :href="`https://pypi.org/project/godot-gdpm/${version}/`" target="_blank" class="github-link">
            <Icon icon="akar-icons:python-fill" width="16" height="16" />
            {{ t('download.viewOnPyPI') }}
          </a>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'
import { useReleaseDownload, formatSize, formatDate, getPlatform, getArch, parseReleaseNotes } from '../composables/useReleaseDownload'
import { useGitHubReleases } from '../composables/useGitHubReleases'
import { getVersionType, getBadgeClass } from '../utils/version'
import type { VersionType } from '../utils/version'

const { t, locale } = useI18n()
const route = useRoute()
const version = route.params.version as string
const copied = ref(false)

const { release, assets, loading, error } = useReleaseDownload(version)
const { versions } = useGitHubReleases()
const copiedHash = ref('')

const isLatest = computed(() => {
  // Find the latest non-prerelease version
  const latestStable = versions.value.find(v => {
    const type = getVersionType(v)
    return type === 'stable'
  })
  return latestStable === version
})

const versionTags = computed(() => {
  const tags: VersionType[] = []
  const type = getVersionType(version)
  if (type !== 'stable') tags.push(type)
  return tags
})

const renderedNotes = computed(() => {
  if (!release.value?.body) return ''
  const notes = parseReleaseNotes(release.value.body)
  const content = locale.value === 'zh' && notes.zh ? notes.zh : notes.en
  return marked(content)
})

const hasTranslation = computed(() => {
  if (!release.value?.body) return false
  const notes = parseReleaseNotes(release.value.body)
  return !!notes.zh
})

const getPlatformIcon = (name: string): string => {
  if (name.includes('linux')) return 'ri:terminal-box-fill'
  if (name.includes('macos')) return 'ri:apple-fill'
  if (name.includes('windows')) return 'ri:windows-fill'
  return 'ri:folder-zip-fill'
}

const copyInstallCommand = async () => {
  await navigator.clipboard.writeText(`pip install godot-gdpm==${version}`)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const copyHash = async (hash: string, name: string) => {
  await navigator.clipboard.writeText(hash)
  copiedHash.value = name
  setTimeout(() => copiedHash.value = '', 2000)
}
</script>

<style scoped>
.download {
  min-height: 100vh;
  padding: 100px 2rem 60px;
}

.download-content {
  max-width: 800px;
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
  text-align: center;
  padding: 80px 0;
  color: #94A3B8;
}

.error h2 {
  color: #FFFFFF;
  margin: 16px 0 8px;
}

.error p {
  margin-bottom: 24px;
}

.btn-primary {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  background: #478CBF;
  color: #FFFFFF;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #5A9FD4;
}

.version-header {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.version-title {
  font-size: 48px;
  font-weight: 700;
  color: #FFFFFF;
}

.version-badges {
  display: flex;
  gap: 8px;
  align-items: center;
}

.version-badge {
  padding: 4px 10px;
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

.badge-stable {
  background: rgba(72, 187, 120, 0.2);
  color: #48BB78;
}

.badge-dev {
  background: rgba(160, 174, 192, 0.2);
  color: #A0AEC0;
}

.badge-alpha {
  background: rgba(237, 137, 54, 0.2);
  color: #ED8936;
}

.badge-beta {
  background: rgba(236, 201, 75, 0.2);
  color: #ECC94B;
}

.badge-rc {
  background: rgba(66, 153, 225, 0.2);
  color: #4299E1;
}

.version-date {
  font-size: 16px;
  color: #64748B;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #475569;
  margin-bottom: 16px;
}

.assets-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 48px;
}

.asset-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(30, 41, 59, 0.3) 100%);
  border: 1px solid rgba(51, 65, 85, 0.3);
  text-decoration: none;
  transition: all 0.2s;
}

.asset-card:hover {
  border-color: rgba(71, 140, 191, 0.4);
  background: linear-gradient(135deg, rgba(71, 140, 191, 0.1) 0%, rgba(71, 140, 191, 0.05) 100%);
}

.asset-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(71, 140, 191, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #478CBF;
}

.asset-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.asset-name {
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
}

.asset-arch {
  font-size: 13px;
  color: #94A3B8;
}

.asset-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #64748B;
}

.asset-size {
  font-size: 13px;
}

.install-section {
  margin-bottom: 48px;
}

.install-code {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 10px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(51, 65, 85, 0.4);
}

.install-code code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  color: #93C5FD;
}

.copy-btn {
  padding: 6px;
  border-radius: 6px;
  background: rgba(71, 140, 191, 0.1);
  border: none;
  color: #478CBF;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: rgba(71, 140, 191, 0.2);
}

.checksums-section {
  margin-bottom: 48px;
}

.checksum-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checksum-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(51, 65, 85, 0.2);
}

.checksum-icon {
  color: #478CBF;
  flex-shrink: 0;
}

.checksum-name {
  min-width: 280px;
  font-size: 13px;
  color: #94A3B8;
  font-family: 'JetBrains Mono', monospace;
}

.checksum-hash {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.checksum-hash code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #64748B;
  word-break: break-all;
}

.copy-btn-sm {
  padding: 4px;
  border-radius: 4px;
  background: transparent;
  border: none;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.copy-btn-sm:hover {
  color: #478CBF;
  background: rgba(71, 140, 191, 0.1);
}

.release-notes-section {
  margin-bottom: 48px;
}

.translation-notice {
  padding: 8px 12px;
  margin-bottom: 12px;
  border-radius: 6px;
  background: rgba(237, 137, 54, 0.1);
  border: 1px solid rgba(237, 137, 54, 0.2);
  color: #ED8936;
  font-size: 13px;
}

.release-notes {
  padding: 24px;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(51, 65, 85, 0.3);
  color: #94A3B8;
  font-size: 14px;
  line-height: 1.7;
}

.release-notes :deep(h1),
.release-notes :deep(h2),
.release-notes :deep(h3) {
  color: #FFFFFF;
  margin-top: 16px;
  margin-bottom: 8px;
}

.release-notes :deep(h1) {
  font-size: 20px;
}

.release-notes :deep(h2) {
  font-size: 18px;
}

.release-notes :deep(h3) {
  font-size: 16px;
}

.release-notes :deep(p) {
  margin-bottom: 12px;
}

.release-notes :deep(ul),
.release-notes :deep(ol) {
  margin-bottom: 12px;
  padding-left: 24px;
}

.release-notes :deep(li) {
  margin-bottom: 4px;
}

.release-notes :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(71, 140, 191, 0.1);
  color: #93C5FD;
}

.release-notes :deep(pre) {
  margin-bottom: 12px;
  padding: 16px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  overflow-x: auto;
}

.release-notes :deep(pre code) {
  background: none;
  padding: 0;
}

.release-notes :deep(a) {
  color: #478CBF;
  text-decoration: none;
}

.release-notes :deep(a:hover) {
  text-decoration: underline;
}

.release-notes :deep(hr) {
  border: none;
  border-top: 1px solid rgba(51, 65, 85, 0.3);
  margin: 16px 0;
}

.links {
  display: flex;
  gap: 24px;
  padding-top: 32px;
  border-top: 1px solid rgba(51, 65, 85, 0.2);
}

.github-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #94A3B8;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.github-link:hover {
  color: #FFFFFF;
}

@media (max-width: 640px) {
  .version-title {
    font-size: 36px;
  }
}
</style>
