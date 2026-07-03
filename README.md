# GDPM Website

Official website for [GDPM](https://github.com/Abyss-PlayerEG/godot-gdpm) - Godot Dependency Package Manager.

## Features

- Full-page scroll sections with smooth animations
- Custom cursor with hover/click effects
- Circle transition between pages
- GitHub API integration for version list and downloads
- Internationalization (EN/ZH)
- Dark theme with Godot blue (#478CBF) accent
- Responsive design

## Tech Stack

- **Vue 3** + **TypeScript** + **Vite**
- **vue-router** — Routing
- **vue-i18n** — Internationalization
- **GSAP** — Animations
- **@iconify/vue** — Icons

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
src/
├── components/     # Vue components
├── composables/    # Composable functions
├── i18n/           # Internationalization files
├── router/         # Vue Router config
├── views/          # Page components
└── style.css       # Global styles
```

## License

GPL-3.0
