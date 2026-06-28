<template>
  <section id="installation" class="installation">
    <div class="install-content">
      <h2 class="section-title">{{ t('installation.title') }}</h2>
      <p class="section-subtitle">{{ t('installation.subtitle') }}</p>
      <div class="install-code-block">
        <code>{{ t('installation.command') }}</code>
        <button class="copy-btn" @click="copyCommand">
          <Icon :icon="copied ? 'ri:check-line' : 'ri:file-copy-line'" width="16" height="16" />
        </button>
      </div>
      <div class="install-methods">
        <span class="method-tag">
          <Icon icon="ri:mac-fill" width="14" height="14" />
          {{ t('installation.methods.macos') }}
        </span>
        <span class="method-tag">
          <Icon icon="ri:windows-fill" width="14" height="14" />
          {{ t('installation.methods.windows') }}
        </span>
        <span class="method-tag">
          <Icon icon="ri:github-fill" width="14" height="14" />
          {{ t('installation.methods.releases') }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const copied = ref(false)

const copyCommand = async () => {
  await navigator.clipboard.writeText('pip install godot-gdpm')
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<style scoped>
.installation {
  padding: 100px 2rem;
  background: #0B1120;
}

.install-content {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.section-title {
  font-size: 40px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 18px;
  color: #64748B;
  margin-bottom: 40px;
}

.install-code-block {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 18px 28px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(30, 41, 59, 0.5) 100%);
  border: 1px solid rgba(51, 65, 85, 0.4);
  margin-bottom: 32px;
}

.install-code-block code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 18px;
  color: #93C5FD;
}

.copy-btn {
  padding: 8px;
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

.install-methods {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.method-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(51, 65, 85, 0.3);
  font-size: 13px;
  color: #94A3B8;
}

@media (max-width: 640px) {
  .section-title {
    font-size: 32px;
  }
  .install-code-block code {
    font-size: 15px;
  }
}
</style>
