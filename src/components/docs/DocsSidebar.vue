<template>
  <aside class="docs-sidebar" :class="{ open: drawerOpen }">
    <div class="docs-sidebar-section docs-sidebar-version">
      <p class="docs-sidebar-caption">{{ t('docs.version') }}</p>
      <DocsVersionSelect :versions="config.versions" :current="currentTag" @select="switchVersion" />
    </div>
    <Transition name="docs-nav" mode="out-in" @after-enter="updateIndicator">
      <nav v-if="nav" ref="navRef" :key="nav.tag" class="docs-nav">
        <span class="docs-nav-indicator" :style="indicatorStyle"></span>
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
    </Transition>
  </aside>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
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

// Sliding active-item indicator: repositioned after every page or TOC change.
const navRef = ref<HTMLElement | null>(null)
const indicatorStyle = ref<Record<string, string>>({
  transform: 'translateY(0px)',
  height: '0px',
})

function updateIndicator(): void {
  const nav = navRef.value
  const active = nav?.querySelector<HTMLElement>('.docs-nav-link.active')
  if (!nav || !active) return
  indicatorStyle.value = {
    transform: `translateY(${active.offsetTop}px)`,
    height: `${active.offsetHeight}px`,
  }
}

// Page change: same TOC, reposition now. Version change: the new list only
// exists after the out-in transition, which @after-enter also covers.
watch(
  [() => props.nav, () => props.page],
  () => {
    void nextTick(updateIndicator)
  },
  { immediate: true },
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
      // Switching versions returns to the selected version's index page.
      page: 'index',
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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
}

.docs-nav-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  background: #478CBF;
  border-radius: 1px;
  pointer-events: none;
  transition: transform 0.25s ease, height 0.25s ease;
}

/* Version switch: the table of contents slides over to the new list */
.docs-nav-enter-active,
.docs-nav-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.docs-nav-enter-from {
  opacity: 0;
  transform: translateX(14px);
}

.docs-nav-leave-to {
  opacity: 0;
  transform: translateX(-14px);
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
  color: #478CBF;
  font-weight: 600;
}

@media (max-width: 1024px) {
  /* the version picker moved to the mobile bar */
  .docs-sidebar-version {
    display: none;
  }

  .docs-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    /* reset the desktop sticky rule's align-self — with flex-start the
       fixed box resolves to content height instead of stretching to
       top/bottom (full screen) */
    align-self: auto;
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
