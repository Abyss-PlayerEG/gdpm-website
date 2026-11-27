<template>
  <!-- eslint-disable-next-line vue/no-v-html — markdown comes from this repo's own docs/ -->
  <div ref="root" class="markdown" v-html="html" @click="onTabClick"></div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { renderMarkdown } from '../../utils/markdown'

const props = defineProps<{
  text: string
  lang?: string
}>()

const root = ref<HTMLElement | null>(null)

const html = computed(() => renderMarkdown(props.text, props.lang ?? 'en'))

// v-html children produce no Vue listeners — one delegated handler switches tabs.
function onTabClick(event: MouseEvent): void {
  const button = (event.target as HTMLElement).closest<HTMLElement>('.tabbed-tab')
  if (!button || !root.value?.contains(button)) return
  const group = button.closest<HTMLElement>('.tabbed')
  if (!group) return
  const index = button.dataset.tab
  group.querySelectorAll<HTMLElement>('.tabbed-tab').forEach((el) => {
    el.classList.toggle('active', el === button)
  })
  group.querySelectorAll<HTMLElement>('.tabbed-pane').forEach((el) => {
    el.classList.toggle('active', el.dataset.pane === index)
  })
}
</script>

<style scoped>
.markdown {
  font-size: 15px;
  line-height: 1.75;
  color: #E2E8F0;
  word-break: break-word;
}

.markdown :deep(h1) {
  font-size: 28px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 18px;
}

.markdown :deep(h2) {
  font-size: 21px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 32px 0 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.markdown :deep(h3) {
  font-size: 17px;
  font-weight: 600;
  color: #F1F5F9;
  margin: 24px 0 10px;
}

.markdown :deep(h4) {
  font-size: 15px;
  font-weight: 600;
  color: #F1F5F9;
  margin: 20px 0 8px;
}

.markdown :deep(p) {
  margin: 10px 0;
}

.markdown :deep(ul),
.markdown :deep(ol) {
  margin: 10px 0;
  padding-left: 24px;
}

.markdown :deep(li) {
  margin: 4px 0;
}

.markdown :deep(a) {
  color: #478CBF;
}

.markdown :deep(a:hover) {
  text-decoration: underline;
}

.markdown :deep(strong) {
  color: #FFFFFF;
  font-weight: 700;
}

.markdown :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.88em;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(148, 163, 184, 0.14);
}

.markdown :deep(pre) {
  margin: 14px 0;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: #0F172A;
  overflow-x: auto;
}

.markdown :deep(pre code) {
  padding: 0;
  background: transparent;
  font-size: 13px;
  line-height: 1.6;
}

.markdown :deep(blockquote) {
  margin: 14px 0;
  padding: 10px 16px;
  border-left: 3px solid #478CBF;
  background: rgba(71, 140, 191, 0.08);
  border-radius: 0 6px 6px 0;
  color: #CBD5E1;
}

.markdown :deep(table) {
  display: block;
  width: 100%;
  margin: 14px 0;
  border-collapse: collapse;
  font-size: 14px;
  overflow-x: auto;
}

.markdown :deep(th) {
  background: rgba(30, 41, 59, 0.8);
  color: #F1F5F9;
  font-weight: 600;
  text-align: left;
}

.markdown :deep(th),
.markdown :deep(td) {
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.markdown :deep(hr) {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin: 28px 0;
}

.markdown :deep(img) {
  max-width: 100%;
}

/* --- admonition (pymdownx.admonition) --- */

.markdown :deep(.admonition) {
  margin: 14px 0;
  padding: 12px 16px;
  border-left: 4px solid #478CBF;
  border-radius: 4px;
  background: rgba(71, 140, 191, 0.08);
}

.markdown :deep(.admonition-title) {
  margin: 0 0 6px;
  font-weight: 600;
  color: #F1F5F9;
}

.markdown :deep(.admonition > *:last-child) {
  margin-bottom: 0;
}

.markdown :deep(.admonition-warning) {
  border-left-color: #FBBF24;
  background: rgba(251, 191, 36, 0.08);
}

.markdown :deep(.admonition-danger) {
  border-left-color: #F87171;
  background: rgba(248, 113, 113, 0.08);
}

.markdown :deep(.admonition-tip) {
  border-left-color: #34D399;
  background: rgba(52, 211, 153, 0.08);
}

/* --- tabbed (pymdownx.tabbed, alternate_style) --- */

.markdown :deep(.tabbed) {
  margin: 14px 0;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

.markdown :deep(.tabbed-nav) {
  display: flex;
  background: rgba(30, 41, 59, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.markdown :deep(.tabbed-tab) {
  padding: 9px 18px;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: #94A3B8;
  font-size: 13px;
  font-weight: 600;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

.markdown :deep(.tabbed-tab:hover) {
  color: #E2E8F0;
}

.markdown :deep(.tabbed-tab.active) {
  border-bottom-color: #478CBF;
  background: rgba(71, 140, 191, 0.08);
  color: #478CBF;
}

.markdown :deep(.tabbed-pane) {
  display: none;
  padding: 6px 16px 10px;
}

.markdown :deep(.tabbed-pane.active) {
  display: block;
}

.markdown :deep(.tabbed-pane > *:first-child) {
  margin-top: 8px;
}

.markdown :deep(.tabbed-pane > *:last-child) {
  margin-bottom: 4px;
}
</style>
