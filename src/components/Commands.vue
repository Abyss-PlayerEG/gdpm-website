<template>
  <section class="commands">
    <div class="commands-content">
      <h2 class="section-title">{{ t('commands.title') }}</h2>
      <p class="section-subtitle">{{ t('commands.subtitle') }}</p>
      <div class="commands-grid">
        <div v-for="cmd in commandKeys" :key="cmd" class="command-card">
          <code class="command-name">{{ t(`commands.items.${cmd}.name`) }}</code>
          <p class="command-desc">{{ t(`commands.items.${cmd}.desc`) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const commandKeys = ['init', 'create', 'add', 'sync', 'godot']
</script>

<style scoped>
.commands {
  padding: 100px 2rem;
  background: #0F172A;
}

.commands-content {
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
  margin-bottom: 64px;
}

.commands-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.command-card {
  padding: 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(30, 41, 59, 0.3) 100%);
  border: 1px solid rgba(51, 65, 85, 0.3);
  text-align: left;
  transition: all 0.3s ease;
}

.command-card:hover {
  border-color: rgba(71, 140, 191, 0.4);
  transform: translateY(-2px);
}

.command-name {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  font-weight: 600;
  color: #93C5FD;
  margin-bottom: 10px;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(71, 140, 191, 0.1);
}

.command-desc {
  font-size: 14px;
  color: #94A3B8;
  line-height: 1.6;
  min-height: 44px;
}

@media (max-width: 1024px) {
  .commands-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .commands-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .section-title {
    font-size: 32px;
  }
}
</style>
