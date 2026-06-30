<template>
  <section class="hero">
    <div class="hero-content">
      <span class="hero-badge" data-animate="fadeUp" data-delay="0.1">v{{ latestStable }} • {{ t('hero.badgeLabel') }}</span>
      <h1 class="hero-title" data-animate="fadeUp" data-delay="0.2">{{ t('hero.title') }}</h1>
      <p class="hero-subtitle" data-animate="fadeUp" data-delay="0.3">{{ t('hero.subtitle') }}</p>
      <div class="hero-cta-row" data-animate="fadeUp" data-delay="0.4">
        <button class="btn-primary" @click="scrollToQuickStart">{{ t('hero.getStarted') }}</button>
        <router-link :to="`/download/${latestStable}`" class="btn-secondary">
          {{ t('hero.downloadLatest') }} v{{ latestStable }}
        </router-link>
      </div>
      <div v-if="latestPreRelease" class="hero-pre-release" data-animate="fadeUp" data-delay="0.5">
        <router-link :to="`/download/${latestPreRelease}`" class="pre-release-link">
          {{ t('hero.preRelease') }} v{{ latestPreRelease }}
        </router-link>
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGitHubReleases } from '../composables/useGitHubReleases'
import { getVersionType } from '../utils/version'

const emit = defineEmits<{
  (e: 'scroll-to', sectionId: string): void
}>()

const { t } = useI18n()
const { versions } = useGitHubReleases()

const latestStable = computed(() => {
  return versions.value.find(v => getVersionType(v) === 'stable') || versions.value[0] || ''
})

const latestPreRelease = computed(() => {
  return versions.value.find(v => getVersionType(v) !== 'stable') || ''
})

const scrollToQuickStart = () => {
  emit('scroll-to', 'quickstart')
}
</script>

<style scoped>
.hero {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 2rem 40px;
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
  margin-bottom: 16px;
}

.btn-primary {
  min-width: 200px;
  padding: 14px 32px;
  border-radius: 8px;
  border: none;
  background: #478CBF;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #5A9FD4;
}

.btn-secondary {
  min-width: 200px;
  padding: 14px 32px;
  border-radius: 8px;
  background: transparent;
  border: 1.5px solid rgba(71, 140, 191, 0.4);
  color: #478CBF;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: #478CBF;
  background: rgba(71, 140, 191, 0.1);
}

.hero-pre-release {
  margin-top: 12px;
  margin-bottom: 32px;
}

.pre-release-link {
  font-size: 13px;
  color: #64748B;
  text-decoration: none;
  transition: color 0.2s;
}

.pre-release-link:hover {
  color: #ED8936;
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
