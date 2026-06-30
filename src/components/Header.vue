<template>
  <header class="header">
    <div class="header-content">
      <router-link to="/" class="logo-area">
        <img src="/icon.png" alt="GDPM" class="logo-icon">
        <span class="logo-text">GDPM</span>
      </router-link>
      <nav class="nav-links">
        <a href="https://abyss-playereg.github.io/godot-gdpm/" target="_blank" class="nav-link">{{ t('nav.docs') }}</a>
        <router-link to="/version/list" class="nav-link">{{ t('nav.versions') }}</router-link>
        <a href="https://github.com/Abyss-PlayerEG/godot-gdpm" target="_blank" class="nav-link">{{ t('nav.github') }}</a>
        <a href="https://pypi.org/project/godot-gdpm/" target="_blank" class="nav-link">{{ t('nav.pypi') }}</a>
      </nav>
      <div class="header-actions">
        <div class="lang-switcher" @click="toggleLang">
          <div class="lang-slider" :class="{ 'slide-right': locale === 'zh' }"></div>
          <button :class="{ active: locale === 'en' }">EN</button>
          <button :class="{ active: locale === 'zh' }">中文</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const toggleLang = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(11, 17, 32, 0.6);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  transition: opacity 0.2s;
}

.logo-area:hover {
  opacity: 0.8;
}

.logo-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
}

.nav-links {
  display: flex;
  gap: 28px;
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: #94A3B8;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #FFFFFF;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.lang-switcher {
  position: relative;
  display: flex;
  padding: 4px;
  border-radius: 6px;
  background: rgba(30, 41, 59, 0.5);
  cursor: pointer;
}

.lang-slider {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  border-radius: 4px;
  background: #478CBF;
  transition: transform 0.3s ease;
}

.lang-slider.slide-right {
  transform: translateX(100%);
}

.lang-switcher button {
  position: relative;
  z-index: 1;
  padding: 4px 12px;
  border: none;
  background: transparent;
  color: #94A3B8;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.lang-switcher button.active {
  color: #FFFFFF;
}

.header-cta {
  min-width: 120px;
  padding: 8px 16px;
  border-radius: 6px;
  background: #478CBF;
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: background 0.2s;
}

.header-cta:hover {
  background: #5A9FD4;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>
