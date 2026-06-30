<template>
  <header class="header">
    <div class="header-content">
      <router-link to="/" class="logo-area">
        <img src="/icon.png" alt="GDPM" class="logo-icon">
        <span class="logo-text">GDPM</span>
      </router-link>
      <nav class="nav-links">
        <a href="https://abyss-playereg.github.io/godot-gdpm/" target="_blank" class="nav-link">{{ t('nav.docs') }}</a>
        <router-link to="/versions" class="nav-link">{{ t('nav.versions') }}</router-link>
        <a href="https://github.com/Abyss-PlayerEG/godot-gdpm" target="_blank" class="nav-link">{{ t('nav.github') }}</a>
        <a href="https://pypi.org/project/godot-gdpm/" target="_blank" class="nav-link">{{ t('nav.pypi') }}</a>
      </nav>
      <div class="header-actions">
        <div class="lang-switcher">
          <button :class="{ active: locale === 'en' }" @click="locale = 'en'">EN</button>
          <button :class="{ active: locale === 'zh' }" @click="locale = 'zh'">中文</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(11, 17, 32, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(51, 65, 85, 0.3);
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
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 6px;
  background: rgba(30, 41, 59, 0.5);
}

.lang-switcher button {
  padding: 4px 8px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: #94A3B8;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.lang-switcher button.active {
  background: #478CBF;
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
