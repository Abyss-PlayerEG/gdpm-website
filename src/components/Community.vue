<template>
  <section class="community">
    <div class="community-content">
      <h2 class="section-title" data-animate="fadeUp">{{ t('community.title') }}</h2>
      <p class="section-subtitle" data-animate="fadeUp" data-delay="0.1">{{ t('community.subtitle') }}</p>
      <div class="community-links" data-animate="fadeUp" data-delay="0.2">
        <a href="https://github.com/Abyss-PlayerEG/godot-gdpm" target="_blank" class="community-link">
          <Icon icon="ri:github-fill" width="20" height="20" />
          {{ t('community.github') }}
        </a>
        <a href="https://pypi.org/project/godot-gdpm/" target="_blank" class="community-link">
          <Icon icon="akar-icons:python-fill" width="20" height="20" />
          {{ t('community.pypi') }}
        </a>
      </div>
      <p class="footer-text">© 2026 playereg • GPL-3.0 License</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.community {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 2rem;
  background: #0B1120;
}

.community-content {
  max-width: 600px;
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

.community-links {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.community-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(30, 41, 59, 0.3) 100%);
  border: 1px solid rgba(51, 65, 85, 0.3);
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  min-width: 140px;
  justify-content: center;
}

.community-link:hover {
  border-color: rgba(71, 140, 191, 0.5);
  background: linear-gradient(135deg, rgba(71, 140, 191, 0.15) 0%, rgba(71, 140, 191, 0.05) 100%);
  transform: translateY(-2px);
}

.footer-text {
  margin-top: 48px;
  font-size: 13px;
  color: #475569;
}
</style>
