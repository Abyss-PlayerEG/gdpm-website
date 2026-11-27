<template>
  <!-- eslint-disable-next-line vue/no-v-html — markdown comes from this repo's own docs/ -->
  <div class="markdown" v-html="html"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '../../utils/markdown'

const props = defineProps<{ text: string }>()

const html = computed(() => renderMarkdown(props.text))
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
</style>
