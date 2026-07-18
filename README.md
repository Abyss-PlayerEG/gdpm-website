<div align="center">

[![English](https://img.shields.io/badge/English-blue?style=for-the-badge)](README.md) [![简体中文](https://img.shields.io/badge/简体中文-gray?style=for-the-badge)](README_CN.md)

</div>

---

# GDPM Website

> Official website for [GDPM](https://github.com/Abyss-PlayerEG/godot-gdpm) — Godot Dependency Package Manager.

---

## Features

- **Full-page scroll** — Smooth animations with GSAP
- **GitHub API integration** — Version list and downloads
- **API proxy** — Cloudflare Functions with edge caching
- **Internationalization** — EN/ZH support
- **Dark theme** — Godot blue (#478CBF) accent
- **Responsive design** — Mobile and desktop

## Tech Stack

- **Vue 3** + **TypeScript** + **Vite**
- **vue-router** — Routing
- **vue-i18n** — Internationalization
- **GSAP** — Animations
- **Cloudflare Pages** — Hosting & Functions

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Deploy to Cloudflare Pages
pnpm run deploy
```

## API Proxy

The website uses Cloudflare Functions to proxy GitHub API requests:

| Environment | Route | Cache |
|-------------|-------|-------|
| Local dev | Vite proxy → GitHub API | localStorage (1h) |
| Production | Cloudflare Function → GitHub API | Edge cache (2h) |

Benefits:
- Higher rate limit (5000/hour vs 60/hour)
- Token stored securely in environment variables
- Edge caching reduces API calls

## Environment Variables

| Variable | Description | Where to set |
|----------|-------------|--------------|
| `GITHUB_TOKEN` | GitHub API token | Cloudflare Dashboard |

## Project Structure

```
├── functions/          # Cloudflare Functions
│   └── api/
│       └── releases.ts # GitHub releases proxy
├── src/
│   ├── components/     # Vue components
│   ├── composables/    # Composable functions
│   ├── i18n/           # Internationalization files
│   ├── router/         # Vue Router config
│   ├── views/          # Page components
│   └── style.css       # Global styles
├── vite.config.ts      # Vite config with proxy
└── wrangler.toml       # Cloudflare config
```

## License

GPL-3.0 License — see [LICENSE](LICENSE) for details.
