# Cloudflare Pages 优化计划

## 1. API 请求优化（优先级：高）

### 1.1 创建 Cloudflare Function 代理 GitHub API
- [x] 创建 `functions/api/releases.ts`
- [x] 添加 GitHub Token 环境变量（Cloudflare Dashboard）
- [x] 实现边缘缓存（Cache API 或 KV）
- [x] 只返回前端需要的字段，减少传输
- [x] 创建 `.dev.vars.example`（本地测试模板）
- [x] 更新 `.gitignore` 添加 `.dev.vars`

### 1.2 修改前端请求逻辑
- [x] 更新 `src/composables/useGitHubReleases.ts`
- [x] 改为调用 `/api/releases` 本地接口
- [x] 移除前端缓存逻辑（由服务端处理）

### 1.3 本地测试配置
- [x] 安装 wrangler CLI（`npm install -g wrangler`）
- [x] 创建 `.dev.vars` 存放本地 `GITHUB_TOKEN`
- [x] 使用 `npx wrangler pages dev` 启动本地测试
- [x] 添加 `wrangler.toml` 配置
- [x] 添加 WebStorm 运行配置

**收益**：
- Rate limit 从 60次/小时 提升到 5000次/小时
- Token 安全存储在服务端
- 边缘缓存减少 API 调用

---

## 2. 缓存策略优化（优先级：中）

### 2.1 配置静态资源缓存
- [ ] 创建 `public/_headers` 文件
- [ ] 设置 JS/CSS 长期缓存（1年）
- [ ] 设置 HTML 不缓存或短缓存
- [ ] 设置字体/图片缓存策略

---

## 3. 字体加载优化（优先级：中）

- [ ] 自托管 Noto Sans SC 字体
- [ ] 或添加 `preconnect` 加速 Google Fonts
- [ ] 设置 `font-display: swap`

---

## 4. GSAP/Lenis 按需加载（优先级：低）

- [ ] GSAP 动态 import
- [ ] Lenis 仅在需要时加载

---

## 5. SEO 优化（优先级：低）

- [ ] 添加 Open Graph 标签
- [ ] 添加结构化数据
- [ ] 生成 sitemap.xml
