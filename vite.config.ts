import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { readFileSync } from 'fs'

function getGithubToken() {
  try {
    const vars = readFileSync('.dev.vars', 'utf-8')
    const match = vars.match(/GITHUB_TOKEN=(.+)/)
    return match?.[1]?.trim()
  } catch {
    return undefined
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  server: {
    host: true,
    port: 8090,
    proxy: {
      '/api/releases': {
        target: 'https://api.github.com',
        changeOrigin: true,
        secure: false,
        rewrite: () => '/repos/Abyss-PlayerEG/godot-gdpm/releases?per_page=100',
        configure: (proxy) => {
          const token = getGithubToken()
          proxy.on('proxyReq', (proxyReq) => {
            if (token) {
              proxyReq.setHeader('Authorization', `Bearer ${token}`)
            }
            proxyReq.setHeader('User-Agent', 'gdpm-website')
          })
        },
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/vue') || id.includes('node_modules/vue-router') || id.includes('node_modules/vue-i18n')) {
            return 'vue-vendor'
          }
          if (id.includes('node_modules/lenis')) {
            return 'lenis'
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})