# 文档渲染功能设计（版本化文档站点）

> **数据源**：godot-gdpm 仓库 `docs/` 目录（`docs.json` 配置 + Markdown），官网直接从 GitHub 拉取渲染，无需后端。
> **前置已就绪**：godot-gdpm 侧配置已按消费端优化完毕（`3cffac4` / `ff61686` / `47dab25`），含 URL 模板、版本索引、双语 nav 标签。
> **状态**：待开发

## 1. 背景与目标

- godot-gdpm 每个版本一套文档（v0.0.3 / v0.0.6 / v0.1.0a1），en/zh 双语，共 38 页
- 目标：官网 `/docs` 路径渲染，支持版本切换、语言切换，视觉与已退役的 mkdocs-material 站点对齐

## 2. 数据源（godot-gdpm 仓库侧）

### 2.1 两层配置

| 文件 | 内容 | 用途 |
|------|------|------|
| `docs/docs.json`（共享） | `source`（ref + cdn/raw URL 模板）、`versions` 索引、`languages`、`markdown_extensions`、`features` | 首跳一次请求 |
| `docs/<tag>/docs.json`（版本自包含） | `version`、`tag`、`nav: [{file, label: {en, zh}}]` | 单版本完整侧栏，与共享配置并行加载 |

- **配置里故意没有 `channel` / `latest` 字段**——权威来源是 GitHub API，见 §4
- `versions` 索引按新→旧排序，纯 tag 字符串，用于发现版本目录

### 2.2 URL 模板（配置内已提供，勿硬编码）

```
cdn: https://cdn.jsdelivr.net/gh/{repo}@{ref}/docs/{version}/{lang}/{file}   ← 优先
raw: https://raw.githubusercontent.com/{repo}/{ref}/docs/{version}/{lang}/{file}  ← 兜底
```

- 替换占位符 `{repo}` `{ref}`（取自共享配置），`{version}` = tag、`{lang}` = 语言目录、`{file}` = 页文件
- 两源均已实测 200（CORS 开放）
- **`ref` 当前 = `dev`**（`main` 上只有 v0.1.0a1 目录且无 docs.json）；下次 godot-gdpm 发版 PR 合入 main 后改共享配置的 `source.ref` 为 `main`

### 2.3 markdown_extensions → 渲染能力清单

| 配置项 | 文档中的实际语法 | 实现方案 |
|--------|------------------|----------|
| `admonition` | `!!! note` / `!!! note "标题"` | marked 自定义扩展（§7） |
| `pymdownx.tabbed` | `=== "标签"` + 缩进块 | marked 自定义扩展（§7） |
| `tables` | 228 行表格 | marked GFM 原生 ✓ |
| `pymdownx.superfences` | 代码围栏 | marked 原生 ✓ |
| `pymdownx.highlight` | — | highlight.js（新依赖） |
| `attr_list` / `md_in_html` / `pymdownx.inlinehilite` | 未实际用到 | 暂不实现，能力缺失时原文降级展示 |

## 3. 路由设计

```
/docs/:version?/:lang?/:page?
```

- 缺省 `version` = 与 `latestTag` 匹配的文档版本，否则 `versions[0]`
- 缺省 `lang` = `languages` 中 `default: true` 的语言（en）
- 缺省 `page` = `index.md`
- `/docs` → `router.replace` 补全为规范 URL
- 每页 `document.title` = nav 标签 + 版本号

## 4. 版本徽标（复用现有工具，勿重新发明）

- **Latest**：`tag === latestTag`（来自 `useGitHubReleases()`）
  - `latestTag` 是 GitHub `/releases/latest` 官方指针（`functions/api/releases.ts` 注释已说明：**不可从列表推导**）
  - 与 Versions 页同一份缓存、同一判断逻辑，全站徽标天然一致
- **渠道徽标**：`isPrerelease()`（GitHub 标志）+ `getVersionType()`（解析出 alpha/beta/rc 徽标样式，Download.vue 同款）
- ❌ 禁止使用 `getVersionBadge(version, index)`——**已无调用点的死代码**，是"index 0 = Latest"的旧方案
- ❌ 禁止自己"取索引第一个 stable"推导 latest——与全站语义不一致

## 5. 组合式（照 `useGitHubReleases` 的缓存模式）

### 5.1 `useDocsConfig()`

- 拼 URL 拉 `docs/docs.json`；内存单例 + localStorage（5 分钟 TTL，沿用 `CACHE_DURATION` 惯例）
- 失败 → 标记不可用，Header 隐藏「文档」入口（优雅降级）

### 5.2 `useVersionNav(tag)`

- 拉 `docs/<tag>/docs.json`，同缓存模式；与共享配置**并行**加载（版本文件自包含，无依赖）

### 5.3 `useDocPage(tag, lang, file)`

- 链路：cdn → 失败 → raw → 失败 → 语言回落 default → 仍失败 → 404 态
- 内存 `Map` 缓存，key = `${tag}/${lang}/${file}`

## 6. 组件结构

```
src/
├── views/Docs.vue                    ← 布局：侧栏 + 内容 + 移动端抽屉
├── components/docs/
│   ├── DocsSidebar.vue               ← nav 列表 + 版本选择 + 语言切换
│   ├── DocsVersionSelect.vue         ← 版本下拉 + Latest/渠道徽标
│   ├── DocsLangSwitch.vue            ← en/zh 切换
│   └── MarkdownView.vue              ← v-html + 事件委托（tab 切换、复制）
├── composables/
│   ├── useDocsConfig.ts
│   ├── useVersionNav.ts
│   └── useDocPage.ts
└── utils/markdown.ts                 ← marked + 自定义扩展
```

- Header 增加「文档」入口（`src/i18n.ts` 补中英文 key）
- 路由级 code split：`Docs.vue` 动态 import，不进主 bundle

## 7. Markdown 管线

- **marked**（已有依赖，GFM 表格/围栏原生支持）
- 自定义扩展 A —— admonition：

  ```
  !!! note "标题"
      内容
  ```
  → `<div class="admonition note"><p class="admonition-title">标题</p>…</div>`

- 自定义扩展 B —— tabbed（对应 `alternate_style`，无内容下划线）：

  ```
  === "macOS / Linux"
      ```bash … ```
  === "Windows"
      …
  ```
  → `.tabbed` 容器 + 按钮组 + 面板；**事件委托**处理点击切换（v-html 不产生 Vue 子组件）

- 代码高亮：highlight.js（新依赖）；复制按钮复用 `CopyButton.vue`（对应 `features: content.code.copy`）
- 安全：md 来自本仓库（可信源），DOMPurify 可选——实现时再定，若加则一行 `marked.use(DOMPurify.sanitize)`

## 8. 样式

- Tailwind 4；徽标直接复用现有 `badge-latest` / `badge-alpha` 等类
- admonition / tabbed 视觉对照 mkdocs-material（左侧色条 + 浅色底）
- 响应式：`< 1024px` 侧栏收成抽屉（参照现有移动端适配惯例）
- 暗色主题：跟随站点 palette（待「暗色主题切换」任务落地后接入）

## 9. 缓存与性能

| 资源 | 策略 |
|------|------|
| 共享/版本配置 | 内存单例 + localStorage 5min TTL |
| md 页面 | 内存 Map + CDN HTTP 缓存（分支内容 12h，见 §11） |
| releases（徽标数据） | 复用现有 `/api/releases`（s-maxage=7200） |

## 10. 实施清单

- [ ] **P1 数据层**：`utils/markdown.ts` 骨架 + `useDocsConfig` + `useVersionNav` + `useDocPage`（cdn/raw 降级）
- [ ] **P2 路由与布局**：`/docs` 路由 + `Docs.vue` + 侧栏 nav + 版本/语言切换 + Header「文档」入口（i18n）
- [ ] **P3 渲染**：`MarkdownView` + admonition 扩展 + tabbed 扩展 + 样式
- [ ] **P4 增强**：highlight.js + 代码复制 + Latest/渠道徽标 + 移动端抽屉
- [ ] **P5 打磨**：语言回落提示 + 404 态 + `document.title` + 加载态（复用 `RouteLoading`）
- [ ] **验收**：3 版本 × 双语 × 全部页面可达；断网 / 配置 404 时优雅降级；徽标与 Versions 页一致

## 11. 坑与注意

1. **jsDelivr 对分支缓存 ~12h**——开发期改配置后用
   `https://purge.jsdelivr.net/gh/Abyss-PlayerEG/godot-gdpm@dev/docs/docs.json` 强刷
2. **发布版文档不在对应 tag 里**（docs 是后补提交的）——`ref` 必须是分支；`tag` 字段只标识"文档描述的版本"，两者不可混用
3. **GitHub Latest 不可推导**（`make_latest` 不进 API、prerelease 标志不管它）——必须复用 `latestTag`
4. **版本比较要语义化**（`0.0.10 > 0.0.9`），勿字符串排序
5. **`ref` 切换时机**——godot-gdpm 下次发版 PR 把 docs 合入 main 后，共享配置 `source.ref` 改 `main`
