<template>
  <section class="demo-page">
    <h1>Modal Demo</h1>
    <p class="desc">弹窗组件使用示例</p>

    <div class="demo-section">
      <h2>1. 基础用法</h2>
      <p class="hint">使用 <code>v-model:visible</code> 控制显示</p>
      <button class="demo-btn" @click="showBasic = true">打开弹窗</button>
      <Modal v-model:visible="showBasic" title="基础弹窗">
        <p>这是一个基础弹窗内容。</p>
      </Modal>
    </div>

    <div class="demo-section">
      <h2>2. 自定义宽度 + Footer</h2>
      <p class="hint">使用 <code>width</code> 属性和 <code>#footer</code> 插槽</p>
      <button class="demo-btn" @click="showCustom = true">自定义弹窗</button>
      <Modal v-model:visible="showCustom" title="自定义宽度" width="600px">
        <p>这是一个更宽的弹窗，带有自定义底部按钮。</p>
        <template #footer>
          <button class="demo-btn secondary" @click="showCustom = false">取消</button>
          <button class="demo-btn" @click="showCustom = false">确认</button>
        </template>
      </Modal>
    </div>

    <div class="demo-section">
      <h2>3. 不可点击遮罩关闭</h2>
      <p class="hint">设置 <code>:mask-closable="false"</code></p>
      <button class="demo-btn" @click="showNoMask = true">打开弹窗</button>
      <Modal v-model:visible="showNoMask" title="必须点击关闭" :mask-closable="false">
        <p>点击遮罩不会关闭，必须点击右上角 X 按钮。</p>
      </Modal>
    </div>

    <div class="demo-section">
      <h2>4. 脚本调用</h2>
      <p class="hint">使用 <code>useModal()</code> 组合式函数</p>
      <button class="demo-btn" @click="openScriptModal">脚本打开弹窗</button>
    </div>

    <div class="demo-section">
      <h2>5. 代码示例</h2>
      <div class="code-block">
        <pre><code>// 组件方式
&lt;Modal v-model:visible="show" title="标题"&gt;
  &lt;p&gt;内容&lt;/p&gt;
&lt;/Modal&gt;

// 脚本方式
import { useModal } from '@/composables/useModal'
const modal = useModal()
modal.open({ title: '标题', content: '内容' })</code></pre>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Modal from '../../components/Modal.vue'
import { useModal } from '../../composables/useModal'

const showBasic = ref(false)
const showCustom = ref(false)
const showNoMask = ref(false)
const modal = useModal()

const openScriptModal = () => {
  modal.open({
    title: '脚本弹窗',
    content: '这是通过 useModal() 脚本调用打开的弹窗。',
  })
}
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  padding: 100px 2rem 60px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 36px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 8px;
}

.desc {
  color: #94A3B8;
  margin-bottom: 48px;
}

.demo-section {
  margin-bottom: 32px;
  padding: 24px;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.3);
  border: 1px solid rgba(51, 65, 85, 0.3);
}

h2 {
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 8px;
}

.hint {
  font-size: 14px;
  color: #94A3B8;
  margin-bottom: 16px;
}

.hint code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #93C5FD;
  background: rgba(71, 140, 191, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.demo-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: #478CBF;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.demo-btn:hover {
  background: #5A9FD4;
}

.demo-btn.secondary {
  background: transparent;
  border: 1px solid rgba(71, 140, 191, 0.4);
  color: #478CBF;
}

.demo-btn.secondary:hover {
  border-color: #478CBF;
}

.code-block {
  padding: 16px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(51, 65, 85, 0.3);
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
}

.code-block code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #93C5FD;
  line-height: 1.6;
}
</style>
