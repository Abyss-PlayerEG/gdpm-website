<div align="center">

[![English](https://img.shields.io/badge/English-gray?style=for-the-badge)](README.md) [![简体中文](https://img.shields.io/badge/简体中文-blue?style=for-the-badge)](README_CN.md)

</div>

---

# GDPM 网站

> [GDPM](https://github.com/Abyss-PlayerEG/godot-gdpm) 官方网站 — Godot 依赖包管理器。

---

## 功能特性

- **全屏滚动** — GSAP 流畅动画
- **GitHub API 集成** — 版本列表和下载
- **API 代理** — Cloudflare Functions 边缘缓存
- **国际化** — 支持中文/英文
- **暗色主题** — Godot 蓝 (#478CBF) 强调色
- **响应式设计** — 移动端和桌面端

## 技术栈

- **Vue 3** + **TypeScript** + **Vite**
- **vue-router** — 路由
- **vue-i18n** — 国际化
- **GSAP** — 动画
- **Cloudflare Pages** — 托管 & Functions

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 部署到 Cloudflare Pages
pnpm run deploy
```

## API 代理

网站使用 Cloudflare Functions 代理 GitHub API 请求：

| 环境 | 路径 | 缓存 |
|------|------|------|
| 本地开发 | Vite 代理 → GitHub API | localStorage（1小时） |
| 生产环境 | Cloudflare Function → GitHub API | 边缘缓存（2小时） |

优势：
- 更高速率限制（5000次/小时 vs 60次/小时）
- Token 安全存储在环境变量中
- 边缘缓存减少 API 调用

## 环境变量

| 变量 | 说明 | 配置位置 |
|------|------|----------|
| `GITHUB_TOKEN` | GitHub API 令牌 | Cloudflare Dashboard |

## 项目结构

```
├── functions/          # Cloudflare Functions
│   └── api/
│       └── releases.ts # GitHub releases 代理
├── src/
│   ├── components/     # Vue 组件
│   ├── composables/    # 组合式函数
│   ├── i18n/           # 国际化文件
│   ├── router/         # Vue Router 配置
│   ├── views/          # 页面组件
│   └── style.css       # 全局样式
├── vite.config.ts      # Vite 配置（含代理）
└── wrangler.toml       # Cloudflare 配置
```

## 许可证

GPL-3.0 许可证 — 详见 [LICENSE](LICENSE)。
