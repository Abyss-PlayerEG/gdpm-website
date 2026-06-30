<template>
  <section id="installation" class="installation">
    <div class="install-content">
      <h2 class="section-title">{{ t('installation.title') }}</h2>
      <p class="section-subtitle">{{ t('installation.subtitle') }}</p>
      <div class="install-code-block">
        <code>{{ t('installation.command') }}</code>
        <CopyButton :text="t('installation.command')" :size="16" />
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
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import CopyButton from './CopyButton.vue'

const { t } = useI18n()
</script>
