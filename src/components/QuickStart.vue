<template>
  <section id="quickstart" class="quickstart">
    <div class="quickstart-content">
      <h2 class="section-title">{{ t('quickstart.title') }}</h2>
      <p class="section-subtitle">{{ t('quickstart.subtitle') }}</p>

      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3 class="step-title">{{ t('quickstart.step1Title') }}</h3>
            <div class="code-block">
              <code>pip install godot-gdpm</code>
              <button class="copy-btn" @click="copyInstall">
                <Icon :icon="copiedInstall ? 'ri:check-line' : 'ri:file-copy-line'" width="14" height="14" />
              </button>
            </div>
          </div>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3 class="step-title">{{ t('quickstart.step2Title') }}</h3>
            <div class="code-blocks">
              <div class="code-block">
                <code>cd my-godot-project && gdpm init</code>
                <button class="copy-btn" @click="copyInit">
                  <Icon :icon="copiedInit ? 'ri:check-line' : 'ri:file-copy-line'" width="14" height="14" />
                </button>
              </div>
              <span class="code-or">{{ t('quickstart.or') }}</span>
              <div class="code-block">
                <code>gdpm create my-game</code>
                <button class="copy-btn" @click="copyCreate">
                  <Icon :icon="copiedCreate ? 'ri:check-line' : 'ri:file-copy-line'" width="14" height="14" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3 class="step-title">{{ t('quickstart.step3Title') }}</h3>
            <div class="code-block">
              <code>gdpm add limbo-ai</code>
              <button class="copy-btn" @click="copyAdd">
                <Icon :icon="copiedAdd ? 'ri:check-line' : 'ri:file-copy-line'" width="14" height="14" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <a href="https://abyss-playereg.github.io/godot-gdpm/" target="_blank" class="docs-link">
        {{ t('quickstart.viewDocs') }}
        <Icon icon="ri:arrow-right-line" width="16" height="16" />
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const copiedInstall = ref(false)
const copiedInit = ref(false)
const copiedCreate = ref(false)
const copiedAdd = ref(false)

const copy = async (text: string, ref: { value: boolean }) => {
  await navigator.clipboard.writeText(text)
  ref.value = true
  setTimeout(() => ref.value = false, 2000)
}

const copyInstall = () => copy('pip install godot-gdpm', copiedInstall)
const copyInit = () => copy('cd my-godot-project && gdpm init', copiedInit)
const copyCreate = () => copy('gdpm create my-game', copiedCreate)
const copyAdd = () => copy('gdpm add limbo-ai', copiedAdd)
</script>

<style scoped>
.quickstart {
  padding: 100px 2rem;
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
  gap: 12px;
  flex-wrap: wrap;
}

.code-or {
  font-size: 13px;
  color: #64748B;
}

.code-block code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #93C5FD;
}

.copy-btn {
  padding: 4px;
  border-radius: 4px;
  background: transparent;
  border: none;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  color: #478CBF;
  background: rgba(71, 140, 191, 0.1);
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
  .section-title {
    font-size: 32px;
  }
}
</style>
