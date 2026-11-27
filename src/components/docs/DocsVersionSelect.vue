<template>
  <div ref="root" class="version-select">
    <button class="version-select-toggle" type="button" @click="open = !open">
      <span class="version-select-current">{{ current.replace(/^v/, '') }}</span>
      <span class="version-select-caret" :class="{ open }">▾</span>
    </button>
    <ul v-if="open" class="version-select-menu">
      <li v-for="row in rows" :key="row.tag">
        <button
          class="version-select-item"
          :class="{ active: row.tag === current }"
          type="button"
          @click="choose(row.tag)"
        >
          <span>{{ row.version }}</span>
          <span v-if="row.badge" class="docs-badge" :class="row.badge.cls">
            {{ row.badge.label }}
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useGitHubReleases } from '../../composables/useGitHubReleases'
import { getVersionType } from '../../utils/version'

const props = defineProps<{
  versions: string[]
  current: string
}>()

const emit = defineEmits<{ select: [tag: string] }>()

const { latestTag } = useGitHubReleases()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

interface Badge {
  label: string
  cls: string
}

// Latest comes from GitHub's own designation (same source as the versions
// page) — never derived from the version string.
function badgeOf(tag: string): Badge | null {
  const version = tag.replace(/^v/, '')
  if (version === latestTag.value) return { label: 'Latest', cls: 'badge-latest' }
  const type = getVersionType(version)
  if (type !== 'stable') return { label: type.toUpperCase(), cls: `badge-${type}` }
  return null
}

const rows = computed(() =>
  props.versions.map((tag) => ({
    tag,
    version: tag.replace(/^v/, ''),
    badge: badgeOf(tag),
  })),
)

function choose(tag: string): void {
  open.value = false
  emit('select', tag)
}

function onDocumentClick(event: MouseEvent): void {
  if (root.value && !root.value.contains(event.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>

<style scoped>
.version-select {
  position: relative;
}

.version-select-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: rgba(30, 41, 59, 0.6);
  color: #E2E8F0;
  font-size: 14px;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
}

.version-select-caret {
  font-size: 10px;
  color: #94A3B8;
  transition: transform 0.2s;
}

.version-select-caret.open {
  transform: rotate(180deg);
}

.version-select-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 10;
  list-style: none;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: #1E293B;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
}

.version-select-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #E2E8F0;
  font-size: 13px;
  font-family: 'JetBrains Mono', monospace;
  text-align: left;
  transition: background 0.15s;
}

.version-select-item:hover {
  background: rgba(71, 140, 191, 0.15);
}

.version-select-item.active {
  background: rgba(71, 140, 191, 0.22);
}

.docs-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.badge-latest {
  background: rgba(71, 140, 191, 0.2);
  color: #478CBF;
}

.badge-alpha,
.badge-beta,
.badge-rc,
.badge-dev {
  background: rgba(251, 191, 36, 0.15);
  color: #FBBF24;
}
</style>
