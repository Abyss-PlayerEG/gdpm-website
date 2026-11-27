<template>
  <aside class="docs-sidebar" :class="{ open: drawerOpen }">
    <div class="docs-sidebar-section">
      <p class="docs-sidebar-caption">{{ t('docs.version') }}</p>
      <DocsVersionSelect :versions="config.versions" :current="currentTag" @select="switchVersion" />
    </div>
    <nav v-if="nav" class="docs-nav">
      <router-link
        v-for="entry in nav.nav"
        :key="entry.file"
        :to="linkTo(entry.file)"
        class="docs-nav-link"
        :class="{ active: isActive(entry.file) }"
        @click="emit('navigate')"
      >
        {{ labelOf(entry) }}
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { DocsNavEntry, DocsSharedConfig, DocsVersionConfig } from '../../utils/docs'
import DocsVersionSelect from './DocsVersionSelect.vue'

const props = defineProps<{
  config: DocsSharedConfig
  nav: DocsVersionConfig | null
  version: string
  lang: string
  page: string
  drawerOpen: boolean
}>()

const emit = defineEmits<{ navigate: [] }>()
const router = useRouter()
const { t } = useI18n()

const cleanVersion = computed(() => props.version.replace(/^v/, ''))
const currentTag = computed(() => (cleanVersion.value ? `v${cleanVersion.value}` : ''))
const defaultLang = computed(
  () => props.config.languages.find((l) => l.default)?.folder ?? 'en',
)

function linkTo(file: string): { name: string; params: Record<string, string> } {
  return {
    name: 'docs',
    params: {
      version: cleanVersion.value,
      lang: props.lang || defaultLang.value,
      page: file.replace(/\.md$/, ''),
    },
  }
}

function isActive(file: string): boolean {
  return file === `${props.page || 'index'}.md`
}

function labelOf(entry: DocsNavEntry): string {
  return entry.label[props.lang] ?? entry.label[defaultLang.value] ?? entry.file
}

function switchVersion(tag: string): void {
  router.push({
    name: 'docs',
    params: {
      version: tag.replace(/^v/, ''),
      lang: props.lang || defaultLang.value,
      page: props.page || 'index',
    },
  })
  emit('navigate')
}
</script>

<style scoped>
.docs-sidebar {
  width: 240px;
  flex-shrink: 0;
  position: sticky;
  top: 88px;
  align-self: flex-start;
}

.docs-sidebar-section {
  margin-bottom: 20px;
}

.docs-sidebar-caption {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748B;
  margin-bottom: 8px;
}

.docs-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
}

.docs-nav-link {
  margin-left: -1px;
  padding: 7px 14px;
  border-left: 2px solid transparent;
  font-size: 14px;
  color: #94A3B8;
  transition: color 0.2s, border-color 0.2s;
}

.docs-nav-link:hover {
  color: #E2E8F0;
}

.docs-nav-link.active {
  border-left-color: #478CBF;
  color: #478CBF;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .docs-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 300;
    width: 280px;
    padding: 84px 20px 24px;
    background: #0F172A;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    overflow-y: auto;
  }

  .docs-sidebar.open {
    transform: translateX(0);
  }
}
</style>
