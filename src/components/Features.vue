<template>
  <section id="features" class="features">
    <div class="features-content">
      <h2 class="section-title" data-animate="fadeUp">{{ t('features.title') }}</h2>
      <p class="section-subtitle" data-animate="fadeUp" data-delay="0.1">{{ t('features.subtitle') }}</p>
      <div class="features-grid">
        <div v-for="(feature, index) in features" :key="feature.key" class="feature-card" data-animate="fadeUp" :data-delay="0.2 + index * 0.1">
          <div class="feature-icon">
            <Icon :icon="feature.icon" width="24" height="24" />
          </div>
          <h3 class="feature-title">{{ t(`features.items.${feature.key}.title`) }}</h3>
          <p class="feature-desc">{{ t(`features.items.${feature.key}.desc`) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const features = [
  { key: 'install', icon: 'lucide:download' },
  { key: 'dependency', icon: 'lucide:link' },
  { key: 'version', icon: 'lucide:zap' },
  { key: 'engine', icon: 'lucide:gamepad-2' }
]
</script>

<style scoped>
.features {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 2rem;
  background: #0B1120;
  overflow: hidden;
}

.features-content {
  max-width: 1200px;
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
  margin-bottom: 48px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  min-width: 0;
}

.feature-card {
  min-height: 200px;
  min-width: 180px;
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(30, 41, 59, 0.3) 100%);
  border: 1px solid rgba(51, 65, 85, 0.3);
  text-align: left;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}

.feature-card:hover {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(30, 41, 59, 0.5) 100%);
  border-color: rgba(71, 140, 191, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(71, 140, 191, 0.2) 0%, rgba(71, 140, 191, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: #478CBF;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 10px;
}

.feature-desc {
  font-size: 14px;
  color: #94A3B8;
  line-height: 1.7;
  min-height: 60px;
}

@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .features {
    min-height: 100vh;
    padding: 80px 0;
  }
  .features-content {
    padding: 0 1rem;
  }
  .section-title {
    font-size: 32px;
    margin-bottom: 12px;
  }
  .section-subtitle {
    font-size: 16px;
    margin-bottom: 40px;
  }
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .feature-card {
    min-height: auto;
    padding: 20px 8px;
    text-align: center;
    border-radius: 14px;
  }
  .feature-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    margin: 0 auto 12px;
  }
  .feature-title {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 0;
  }
  .feature-desc {
    display: none;
  }
}
</style>
