import { useModal } from './useModal'
import { i18n } from '../i18n'

const messages = {
  en: {
    title: '👋 Hey there, developer!',
    description: 'We\'re building <strong>GDPM</strong> — a dependency package manager for Godot plugins.',
    looking: 'Interested in contributing? We\'re looking for:',
    roles: [
      'Python developers',
      'Vue.js developers',
      'Godot enthusiasts',
      'Documentation writers',
    ],
    link: 'Check out the repo →',
  },
  zh: {
    title: '👋 你好，开发者！',
    description: '我们正在开发 <strong>GDPM</strong> — 一个 Godot 插件的依赖包管理器。',
    looking: '有兴趣贡献吗？我们正在寻找：',
    roles: [
      'Python 开发者',
      'Vue.js 开发者',
      'Godot 爱好者',
      '文档撰写者',
    ],
    link: '查看仓库 →',
  },
}

export function useDevtoolsDetector() {
  const modal = useModal()
  let detected = false

  const showRecruitModal = () => {
    if (detected) return
    detected = true

    const lang = i18n.global.locale.value as 'en' | 'zh'
    const msg = messages[lang] || messages.en
    const rolesHtml = msg.roles.map(r => `<div>• ${r}</div>`).join('')

    modal.open({
      title: msg.title,
      content: `
        <div style="padding: 1rem 0;">
          <p style="font-size: 16px; margin-bottom: 1rem;">${msg.description}</p>
          <p style="margin-bottom: 1.5rem;">${msg.looking}</p>
          <div style="margin-bottom: 1.5rem;">${rolesHtml}</div>
          <p>
            <a href="https://github.com/Abyss-PlayerEG/godot-gdpm" target="_blank"
               style="color: #478CBF; font-weight: 600;">
              ${msg.link}
            </a>
          </p>
        </div>
      `,
      width: '500px',
      closable: true,
      maskClosable: true,
    })
  }

  const detect = () => {
    const start = performance.now()
    debugger
    const end = performance.now()
    if (end - start > 100) {
      showRecruitModal()
      return
    }

    const threshold = 200
    if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
      showRecruitModal()
    }
  }

  const startDetection = () => {
    setInterval(detect, 3000)
  }

  return { startDetection }
}
