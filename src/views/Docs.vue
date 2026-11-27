<template>
  <div class="docs-page">
    <div class="docs-mobile-bar">
      <button class="docs-mobile-btn" type="button" @click="drawerOpen = !drawerOpen">
        ☰ {{ t('docs.menu') }}
      </button>
      <DocsVersionSelect
        v-if="config"
        class="docs-mobile-version"
        :versions="config.versions"
        :current="currentTag"
        @select="switchVersion"
      />
    </div>

    <div v-if="drawerOpen" class="docs-drawer-overlay" @click="drawerOpen = false"></div>

    <div class="docs-layout">
      <DocsSidebar
        v-if="config"
        :config="config"
        :nav="nav"
        :version="versionParam"
        :lang="langParam"
        :page="pageParam"
        :drawer-open="drawerOpen"
        @navigate="drawerOpen = false"
      />

      <main class="docs-content">
        <div v-if="configError" class="docs-state docs-state-error">
          <p class="docs-state-title">{{ t('docs.error') }}</p>
          <p class="docs-state-detail">{{ configError }}</p>
          <div class="docs-state-actions">
            <button class="docs-state-btn" type="button" @click="reloadConfig">
              {{ t('docs.retry') }}
            </button>
          </div>
        </div>
        <div v-else-if="!config || navLoading || pageLoading" class="docs-state docs-loading">
          <div class="docs-spinner"></div>
          <p>{{ t('docs.loading') }}</p>
        </div>
        <div v-else-if="navError" class="docs-state docs-state-error">
          <p class="docs-state-title">
            {{ navIsNotFound ? t('docs.versionNotFound') : t('docs.error') }}
          </p>
          <p class="docs-state-detail">{{ navError }}</p>
          <div class="docs-state-actions">
            <button
              v-if="navIsNotFound"
              class="docs-state-btn"
              type="button"
              @click="goLatestDocs"
            >
              {{ t('docs.tryLatest') }}
            </button>
            <button v-else class="docs-state-btn" type="button" @click="reloadNav">
              {{ t('docs.retry') }}
            </button>
          </div>
        </div>
        <div v-else-if="pageError" class="docs-state docs-state-error">
          <p class="docs-state-title">
            {{ pageIsNotFound ? t('docs.notFound') : t('docs.error') }}
          </p>
          <p class="docs-state-detail">{{ pageError }}</p>
          <div class="docs-state-actions">
            <button
              v-if="pageIsNotFound"
              class="docs-state-btn"
              type="button"
              @click="goIndex"
            >
              {{ t('docs.backToIndex') }}
            </button>
            <button v-else class="docs-state-btn" type="button" @click="reloadPage">
              {{ t('docs.retry') }}
            </button>
          </div>
        </div>
        <template v-else>
          <div v-if="fallbackNotice" class="docs-fallback">
            {{ t('docs.fallbackNotice') }}
          </div>
          <MarkdownView :text="pageText" :lang="resolvedLang || langParam" />
        </template>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDocsConfig } from '../composables/useDocsConfig'
import { useVersionNav } from '../composables/useVersionNav'
import { useDocPage } from '../composables/useDocPage'
import { useGitHubReleases } from '../composables/useGitHubReleases'
import { getVersionType } from '../utils/version'
import DocsSidebar from '../components/docs/DocsSidebar.vue'
import DocsVersionSelect from '../components/docs/DocsVersionSelect.vue'
import MarkdownView from '../components/docs/MarkdownView.vue'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

const { config, error: configError, reload: reloadConfig } = useDocsConfig()
const { latestTag } = useGitHubReleases()

const drawerOpen = ref(false)

function paramValue(name: string): string {
  const raw = route.params[name]
  return typeof raw === 'string' ? raw : ''
}

const versionParam = computed(() => paramValue('version'))
const langParam = computed(() => paramValue('lang'))
const pageParam = computed(() => paramValue('page'))

const tag = computed(() => {
  const v = versionParam.value
  if (!v) return null
  return v.startsWith('v') ? v : `v${v}`
})
const langRef = computed(() => langParam.value || 'en')
const fileRef = computed(() => `${pageParam.value || 'index'}.md`)

const { nav, loading: navLoading, error: navError, reload: reloadNav } = useVersionNav(
  config,
  tag,
)
const {
  text: pageText,
  resolvedLang,
  loading: pageLoading,
  error: pageError,
  reload: reloadPage,
} = useDocPage(config, tag, langRef, fileRef)

// A404 from the fetch chain means the target genuinely does not exist;
// anything else (timeout, connection reset, 5xx) is a transient failure.
const navIsNotFound = computed(() => (navError.value ?? '').includes('404'))
const pageIsNotFound = computed(() => (pageError.value ?? '').includes('404'))

// The fetch fell back to the default language — say so instead of silently
// serving the wrong language.
const fallbackNotice = computed(
  () => !!pageText.value && !!resolvedLang.value && resolvedLang.value !== langParam.value,
)

function goIndex(): void {
  router.push({
    name: 'docs',
    params: {
      version: versionParam.value.replace(/^v/, ''),
      lang: langParam.value,
      page: 'index',
    },
  })
}

function goLatestDocs(): void {
  router.push({
    name: 'docs',
    params: {
      version: pickDefaultVersion().replace(/^v/, ''),
      lang: langParam.value,
      page: 'index',
    },
  })
}

const currentTag = computed(() => {
  const v = versionParam.value.replace(/^v/, '')
  return v ? `v${v}` : ''
})

// Mobile-bar version picker: same rule as the sidebar one — switching
// versions lands on the selected version's index page.
function switchVersion(tag: string): void {
  router.push({
    name: 'docs',
    params: {
      version: tag.replace(/^v/, ''),
      lang: langParam.value || locale.value,
      page: 'index',
    },
  })
}

// Per-page document title, e.g. "Installation · GDPM Docs 0.0.6".
const pageTitle = computed(() => {
  const entry = nav.value?.nav.find((e) => e.file === fileRef.value)
  if (!entry) return null
  const label = entry.label[langParam.value] ?? entry.label['en'] ?? entry.file
  return `${label} · GDPM Docs ${versionParam.value.replace(/^v/, '')}`
})

watch(
  pageTitle,
  (title) => {
    if (title) document.title = title
  },
  { immediate: true },
)

// Canonical URL: fill any missing param once the config is known.
// Default version prefers GitHub's latest release when it has docs,
// otherwise the newest stable version in the index.
function pickDefaultVersion(): string {
  const cfg = config.value
  if (!cfg) return ''
  const latest = latestTag.value ? `v${latestTag.value}` : ''
  if (latest && cfg.versions.includes(latest)) return latest
  const stable = cfg.versions.find((v) => getVersionType(v.replace(/^v/, '')) === 'stable')
  return stable ?? cfg.versions[0] ?? ''
}

watch(
  // route.path is a source too: the header Docs link can push a bare /docs
  // while this component is reused (config unchanged → that watch alone
  // would never re-fire and the page would hang with empty params).
  [config, () => route.path],
  ([cfg]) => {
    if (!cfg) return
    if (versionParam.value && langParam.value && pageParam.value) return
    router.replace({
      name: 'docs',
      params: {
        version: (versionParam.value || pickDefaultVersion()).replace(/^v/, ''),
        lang: langParam.value || locale.value,
        page: pageParam.value || 'index',
      },
    })
  },
  { immediate: true },
)

// The header switcher is the single language control: the site locale and
// the URL :lang stay in lockstep. A shared /docs/…/zh/… link flips the site
// language for the session; toggling the header rewrites the docs URL.
watch(
  langParam,
  (lang) => {
    if (lang && lang !== locale.value) locale.value = lang
  },
  { immediate: true },
)

watch(locale, (lang) => {
  if (route.name !== 'docs' || !versionParam.value) return
  const current = paramValue('lang')
  if (current && current !== lang) {
    router.replace({
      name: 'docs',
      params: {
        version: versionParam.value.replace(/^v/, ''),
        lang,
        page: pageParam.value || 'index',
      },
    })
  }
})
</script>

<style scoped>
.docs-page {
  min-height: 100vh;
}

.docs-layout {
  display: flex;
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 2rem 80px;
}

.docs-content {
  flex: 1;
  min-width: 0;
}

.docs-state {
  padding: 60px 0;
  color: #94A3B8;
  font-size: 14px;
}

.docs-state-error {
  color: #F87171;
}

.docs-state-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #E2E8F0;
}

.docs-state-detail {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  word-break: break-all;
  opacity: 0.7;
}

.docs-state-btn {
  padding: 8px 20px;
  border: 1px solid rgba(71, 140, 191, 0.4);
  border-radius: 6px;
  background: rgba(71, 140, 191, 0.12);
  color: #478CBF;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s;
}

.docs-state-btn:hover {
  background: rgba(71, 140, 191, 0.25);
}

.docs-state-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.docs-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.docs-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(71, 140, 191, 0.2);
  border-top-color: #478CBF;
  border-radius: 50%;
  animation: docs-spin 0.8s linear infinite;
}

@keyframes docs-spin {
  to {
    transform: rotate(360deg);
  }
}

.docs-fallback {
  margin-bottom: 16px;
  padding: 8px 14px;
  border: 1px solid rgba(251, 191, 36, 0.25);
  border-radius: 6px;
  background: rgba(251, 191, 36, 0.08);
  color: #FBBF24;
  font-size: 13px;
}

.docs-mobile-bar {
  display: none;
}

/* The version picker lives in the mobile bar instead of the drawer */
.docs-mobile-version {
  display: none;
}

@media (max-width: 1024px) {
  .docs-mobile-bar {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    z-index: 250;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    padding: 0 1rem;
    background: rgba(11, 17, 32, 0.85);
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .docs-mobile-btn {
    padding: 6px 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    background: rgba(30, 41, 59, 0.6);
    color: #E2E8F0;
    font-size: 13px;
    font-weight: 600;
  }

  .docs-mobile-version {
    display: block;
    flex-shrink: 0;
    min-width: 104px;
  }

  .docs-mobile-version :deep(.version-select-toggle) {
    padding: 6px 10px;
    font-size: 13px;
  }

  /* the bar picker is narrow — anchor its menu to the right edge and let
     it grow to content so version badges stay inside the box */
  .docs-mobile-version :deep(.version-select-menu) {
    left: auto;
    right: 0;
    width: max-content;
    min-width: 100%;
  }

  .docs-layout {
    flex-direction: column;
    gap: 0;
    padding-top: 140px;
  }

  .docs-drawer-overlay {
    position: fixed;
    inset: 0;
    z-index: 250;
    background: rgba(0, 0, 0, 0.55);
  }
}

@media (min-width: 1025px) {
  .docs-drawer-overlay {
    display: none;
  }
}
</style>
