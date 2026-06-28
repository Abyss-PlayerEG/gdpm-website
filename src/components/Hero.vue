<template>
  <section class="hero">
    <div class="hero-content">
      <span class="hero-badge">v{{ latestVersion }} • {{ t('hero.badgeLabel') }}</span>
      <h1 class="hero-title">{{ t('hero.title') }}</h1>
      <p class="hero-subtitle" v-html="t('hero.subtitle').replace('\n', '<br>')"></p>
      <div class="hero-cta-row">
        <a href="#installation" class="btn-primary">{{ t('hero.getStarted') }}</a>
        <button class="btn-secondary" @click="copyInstallCommand">
          {{ copied ? t('hero.copied') : t('hero.installCommand') }}
        </button>
      </div>
      <div class="code-block">
        <pre><code>$ gdpm add limbo-ai
$ gdpm sync
✓ 3 plugins installed</code></pre>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGitHubReleases } from '../composables/useGitHubReleases'

const { t } = useI18n()
const { latestVersion } = useGitHubReleases()
const copied = ref(false)

const copyInstallCommand = async () => {
  await navigator.clipboard.writeText('pip install godot-gdpm')
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 2rem 80px;
  background: radial-gradient(ellipse at 50% 0%, rgba(71, 140, 191, 0.15) 0%, transparent 50%);
}

.hero-content {
  text-align: center;
  max-width: 800px;
}

.hero-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  background: rgba(71, 140, 191, 0.15);
  color: #478CBF;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 32px;
}

.hero-title {
  font-size: 80px;
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 20px;
  color: #94A3B8;
  line-height: 1.6;
  margin-bottom: 40px;
}

.hero-cta-row {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 48px;
}

.btn-primary {
  min-width: 180px;
  padding: 14px 32px;
  border-radius: 8px;
  background: #478CBF;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #5A9FD4;
}

.btn-secondary {
  padding: 14px 32px;
  border-radius: 8px;
  background: transparent;
  border: 1.5px solid rgba(71, 140, 191, 0.4);
  color: #478CBF;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: #478CBF;
  background: rgba(71, 140, 191, 0.1);
}

.code-block {
  display: inline-block;
  padding: 16px 24px;
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(51, 65, 85, 0.5);
  text-align: left;
}

.code-block pre {
  margin: 0;
}

.code-block code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #93C5FD;
  line-height: 1.8;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 48px;
  }
  .hero-subtitle {
    font-size: 16px;
  }
  .hero-cta-row {
    flex-direction: column;
    align-items: center;
  }
}
</style>
