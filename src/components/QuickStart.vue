<template>
  <section id="quickstart" class="quickstart">
    <div class="quickstart-content">
      <h2 class="section-title" data-animate="fadeUp">{{ t('quickstart.title') }}</h2>
      <p class="section-subtitle" data-animate="fadeUp" data-delay="0.1">{{ t('quickstart.subtitle') }}</p>

      <div class="steps">
        <div class="step" data-animate="fadeLeft" data-delay="0.2">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3 class="step-title">{{ t('quickstart.step1Title') }}</h3>
            <div class="code-block">
              <code>pip install godot-gdpm</code>
              <CopyButton text="pip install godot-gdpm" :size="14" />
            </div>
          </div>
        </div>

        <div class="step" data-animate="fadeLeft" data-delay="0.35">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3 class="step-title">{{ t('quickstart.step2Title') }}</h3>
            <div class="code-blocks">
              <div class="code-block">
                <code>cd my-godot-project && gdpm init</code>
                <CopyButton text="cd my-godot-project && gdpm init" :size="14" />
              </div>
              <span class="code-or">{{ t('quickstart.or') }}</span>
              <div class="code-block">
                <code>gdpm create my-game</code>
                <CopyButton text="gdpm create my-game" :size="14" />
              </div>
            </div>
          </div>
        </div>

        <div class="step" data-animate="fadeLeft" data-delay="0.5">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3 class="step-title">{{ t('quickstart.step3Title') }}</h3>
            <div class="code-block">
              <code>gdpm add limbo-ai</code>
              <CopyButton text="gdpm add limbo-ai" :size="14" />
            </div>
          </div>
        </div>
      </div>

      <a href="https://abyss-playereg.github.io/godot-gdpm/" target="_blank" class="docs-link" data-animate="fadeUp" data-delay="0.65">
        {{ t('quickstart.viewDocs') }}
        <Icon icon="ri:arrow-right-line" width="16" height="16" />
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import CopyButton from './CopyButton.vue'

const { t } = useI18n()
</script>

<style scoped>
.quickstart {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 2rem;
  background: #0B1120;
}

.quickstart-content {
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
  margin-bottom: 64px;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 48px;
  text-align: left;
}

.step {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(71, 140, 191, 0.15);
  color: #478CBF;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 12px;
}

.code-block {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(51, 65, 85, 0.4);
}

.code-blocks {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.code-or {
  font-size: 13px;
  color: #64748B;
}

.code-block code {
  font-family: 'JetBrains Mono Nerd Font', monospace;
  font-size: 14px;
  color: #93C5FD;
}

.docs-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #478CBF;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s;
}

.docs-link:hover {
  color: #93C5FD;
}

@media (max-width: 640px) {
  .quickstart {
    min-height: 100vh;
    height: auto;
    padding: 60px 1rem;
  }
  .section-title {
    font-size: 28px;
    margin-bottom: 12px;
  }
  .section-subtitle {
    font-size: 15px;
    margin-bottom: 32px;
  }
  .steps {
    gap: 20px;
    margin-bottom: 32px;
  }
  .step {
    gap: 12px;
  }
  .step-number {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
  .step-title {
    font-size: 14px;
    margin-bottom: 8px;
  }
  .code-blocks {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .code-or {
    padding-left: 4px;
  }
  .code-block {
    width: 100%;
    padding: 10px 12px;
  }
  .code-block code {
    font-size: 12px;
    word-break: break-all;
  }
}
</style>
