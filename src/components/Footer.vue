<template>
  <footer class="footer">
    <div class="footer-content">
      <span class="footer-copyright">{{ t('footer.copyright') }}</span>
      <div class="footer-links">
        <a href="https://github.com/Abyss-PlayerEG/godot-gdpm" target="_blank" class="footer-link">GitHub</a>
        <a href="https://pypi.org/project/godot-gdpm/" target="_blank" class="footer-link">PyPI</a>
        <a href="https://store.godotengine.org/" target="_blank" class="footer-link">Asset Store</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.footer {
  padding: 0 2rem;
  height: 64px;
  background: #0B1120;
  border-top: 1px solid rgba(51, 65, 85, 0.2);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-copyright {
  font-size: 13px;
  color: #475569;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-link {
  font-size: 13px;
  color: #475569;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #93C5FD;
}
</style>
