import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    nav: {
      docs: 'Docs',
      versions: 'All Versions',
      github: 'GitHub',
      pypi: 'PyPI'
    },
    hero: {
      badgeLabel: 'Open Source',
      title: 'GDPM',
      subtitle: 'Godot Dependency Package Manager',
      tagline: 'like',
      getStarted: 'Get Started',
      downloadLatest: 'Download',
      downloadGDPM: 'Download',
      installCommand: 'pip install godot-gdpm',
      copied: 'Copied!',
      preRelease: 'Get latest pre-release:'
    },
    features: {
      title: 'Features',
      subtitle: 'Everything you need to manage Godot plugins',
      items: {
        install: {
          title: 'One Command Install',
          desc: 'gdpm add limbo-ai instead of manual downloads from Asset Store'
        },
        dependency: {
          title: 'Dependency Management',
          desc: 'Automatic dependency resolution with lock file for reproducible installs'
        },
        version: {
          title: 'Version Constraints',
          desc: 'Support for ^, ~, >= semver syntax for precise version control'
        },
        engine: {
          title: 'Engine Management',
          desc: 'Install, manage, and switch Godot engine versions from CLI'
        }
      }
    },
    installation: {
      title: 'Installation',
      subtitle: 'Get started in seconds',
      command: 'pip install godot-gdpm',
      methods: {
        macos: 'macOS / Linux',
        windows: 'Windows',
        releases: 'GitHub Releases'
      }
    },
    commands: {
      title: 'Commands',
      subtitle: 'Simple and intuitive CLI interface',
      items: {
        init: { name: 'gdpm init', desc: 'Initialize a new gdpm project' },
        create: { name: 'gdpm create', desc: 'Create a new Godot project interactively' },
        add: { name: 'gdpm add', desc: 'Add plugins to the project' },
        sync: { name: 'gdpm sync', desc: 'Sync addons to lock file state' },
        godot: { name: 'gdpm godot', desc: 'Manage Godot engine versions' }
      }
    },
    quickstart: {
      title: 'Quick Start',
      subtitle: 'Get started in 3 simple steps',
      step1Title: 'Install GDPM',
      step2Title: 'Initialize your project or create a new one',
      step3Title: 'Add plugins',
      or: 'or',
      viewDocs: 'View documentation'
    },
    community: {
      title: 'Community',
      subtitle: 'Join the GDPM community',
      github: 'GitHub',
      pypi: 'PyPI'
    },
    footer: {
      copyright: '© 2026 playereg • GPL-3.0 License'
    },
    versions: {
      title: 'Versions',
      subtitle: 'Latest releases',
      allTitle: 'All Versions',
      allSubtitle: 'All released versions of GDPM',
      loading: 'Loading versions...',
      error: 'Failed to load versions',
      retry: 'Retry',
      back: 'Back',
      viewAll: 'View all versions'
    },
    download: {
      back: 'Back',
      notFound: 'Release Not Found',
      notFoundDesc: 'Version {version} does not exist or has been deleted.',
      goHome: 'Go Home',
      downloads: 'Downloads',
      install: 'Installation',
      releaseNotes: 'Release Notes',
      noTranslation: 'Chinese translation not available, showing English version.',
      viewOnGitHub: 'View on GitHub',
      viewOnPyPI: 'View on PyPI'
    },
    notFound: {
      message: 'Page not found',
      redirect: 'Redirecting in {seconds} seconds...',
      goHome: 'Go Home'
    }
  },
  zh: {
    nav: {
      docs: '文档',
      versions: '全部版本',
      github: 'GitHub',
      pypi: 'PyPI'
    },
    hero: {
      badgeLabel: '开源',
      title: 'GDPM',
      subtitle: 'Godot 依赖包管理器',
      tagline: '类似',
      getStarted: '快速开始',
      downloadLatest: '下载',
      downloadGDPM: '下载',
      installCommand: 'pip install godot-gdpm',
      copied: '已复制!',
      preRelease: '获取最新预发布版本:'
    },
    features: {
      title: '特性',
      subtitle: '管理 Godot 插件所需的一切',
      items: {
        install: {
          title: '一键安装',
          desc: 'gdpm add limbo-ai，告别手动从 Asset Store 下载'
        },
        dependency: {
          title: '依赖管理',
          desc: '自动解析依赖，锁文件确保可复现安装'
        },
        version: {
          title: '版本约束',
          desc: '支持 ^、~、>= 语义化版本语法'
        },
        engine: {
          title: '引擎管理',
          desc: '从 CLI 安装、管理和切换 Godot 引擎版本'
        }
      }
    },
    installation: {
      title: '安装',
      subtitle: '几秒即可开始',
      command: 'pip install godot-gdpm',
      methods: {
        macos: 'macOS / Linux',
        windows: 'Windows',
        releases: 'GitHub Releases'
      }
    },
    commands: {
      title: '命令',
      subtitle: '简洁直观的 CLI 接口',
      items: {
        init: { name: 'gdpm init', desc: '初始化新项目' },
        create: { name: 'gdpm create', desc: '交互式创建新 Godot 项目' },
        add: { name: 'gdpm add', desc: '添加插件到项目' },
        sync: { name: 'gdpm sync', desc: '同步 addons 到锁文件状态' },
        godot: { name: 'gdpm godot', desc: '管理 Godot 引擎版本' }
      }
    },
    quickstart: {
      title: '快速开始',
      subtitle: '3 步即可上手',
      step1Title: '安装 GDPM',
      step2Title: '初始化项目或创建新项目',
      step3Title: '添加插件',
      or: '或',
      viewDocs: '查看文档'
    },
    community: {
      title: '社区',
      subtitle: '加入 GDPM 社区',
      github: 'GitHub',
      pypi: 'PyPI'
    },
    footer: {
      copyright: '© 2026 playereg • GPL-3.0 许可证'
    },
    versions: {
      title: '版本',
      subtitle: '最新版本',
      allTitle: '所有版本',
      allSubtitle: 'GDPM 所有已发布的版本',
      loading: '加载版本中...',
      error: '加载版本失败',
      retry: '重试',
      back: '返回',
      viewAll: '查看所有版本'
    },
    download: {
      back: '返回',
      notFound: '未找到版本',
      notFoundDesc: '版本 {version} 不存在或已被删除。',
      goHome: '回到首页',
      downloads: '下载',
      install: '安装',
      releaseNotes: '更新日志',
      noTranslation: '暂无中文翻译，显示英文版本。',
      viewOnGitHub: '在 GitHub 查看',
      viewOnPyPI: '在 PyPI 查看'
    },
    notFound: {
      message: '页面未找到',
      redirect: '{seconds} 秒后返回首页...',
      goHome: '回到首页'
    }
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
})
