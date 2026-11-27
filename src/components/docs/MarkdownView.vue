<template>
  <!-- eslint-disable-next-line vue/no-v-html — markdown comes from this repo's own docs/ -->
  <div ref="root" class="markdown" v-html="html" @click="onContentClick"></div>
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

// v-html children produce no Vue listeners — one delegated handler drives
// both tab switching and code copying.
function onContentClick(event: MouseEvent): void {
  const target = event.target as HTMLElement
  const copyButton = target.closest<HTMLElement>('.md-code > .copy-btn')
  if (copyButton && root.value?.contains(copyButton)) {
    void handleCopy(copyButton)
    return
  }
  const tabButton = target.closest<HTMLElement>('.tabbed-tab')
  if (!tabButton || !root.value?.contains(tabButton)) return
  const group = tabButton.closest<HTMLElement>('.tabbed')
  if (!group) return
  const index = tabButton.dataset.tab
  group.querySelectorAll<HTMLElement>('.tabbed-tab').forEach((el) => {
    el.classList.toggle('active', el === tabButton)
  })
  group.querySelectorAll<HTMLElement>('.tabbed-pane').forEach((el) => {
    el.classList.toggle('active', el.dataset.pane === index)
  })
}

// Mirrors CopyButton.vue: clipboard API with an execCommand fallback and a
// 2s copied state on the button itself.
async function handleCopy(button: HTMLElement): Promise<void> {
  const codeEl = button.parentElement?.querySelector('code')
  if (!codeEl) return
  const text = codeEl.innerText
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
  button.classList.add('copied')
  window.setTimeout(() => button.classList.remove('copied'), 2000)
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

.markdown :deep(.md-table) {
  margin: 14px 0;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  overflow-x: auto;
}

.markdown :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.markdown :deep(th) {
  background: rgba(30, 41, 59, 0.8);
  color: #F1F5F9;
  font-weight: 600;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.markdown :deep(th),
.markdown :deep(td) {
  padding: 9px 14px;
}

.markdown :deep(td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.markdown :deep(tr:last-child td) {
  border-bottom: none;
}

.markdown :deep(tbody tr:hover) {
  background: rgba(71, 140, 191, 0.05);
}

.markdown :deep(hr) {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin: 28px 0;
}

.markdown :deep(img) {
  max-width: 100%;
}

/* --- code block copy button (content.code.copy) --- */

.markdown :deep(.md-code) {
  position: relative;
  margin: 14px 0;
}

.markdown :deep(.md-code > pre) {
  margin: 0;
}

.markdown :deep(.copy-btn) {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #64748B;
  opacity: 0.6;
  transition: all 0.2s;
}

.markdown :deep(.copy-btn:hover) {
  color: #478CBF;
  background: rgba(71, 140, 191, 0.1);
  opacity: 1;
}

.markdown :deep(.copy-icon),
.markdown :deep(.check-icon) {
  display: inline-flex;
  transition: opacity 0.2s;
}

.markdown :deep(.copy-icon) {
  opacity: 1;
}

.markdown :deep(.check-icon) {
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #48BB78;
}

.markdown :deep(.copy-btn.copied .copy-icon) {
  opacity: 0;
}

.markdown :deep(.copy-btn.copied .check-icon) {
  opacity: 1;
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
