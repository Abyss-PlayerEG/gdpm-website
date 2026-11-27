import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { readFileSync } from 'fs'
import type { IncomingMessage, ServerResponse } from 'node:http'

function getGithubToken() {
  try {
    const vars = readFileSync('.dev.vars', 'utf-8')
    const match = vars.match(/GITHUB_TOKEN=(.+)/)
    return match?.[1]?.trim()
  } catch {
    return undefined
  }
}

const RELEASES_URL = 'https://api.github.com/repos/Abyss-PlayerEG/godot-gdpm/releases?per_page=100'
const LATEST_URL = 'https://api.github.com/repos/Abyss-PlayerEG/godot-gdpm/releases/latest'

// Mirrors functions/api/releases.ts. The old proxy returned GitHub's raw list,
// so local dev never had a `latest` designation and the badge could not be
// verified without deploying.
function releasesApi(): Plugin {
  const handler = async (_req: IncomingMessage, res: ServerResponse) => {
    const headers: Record<string, string> = {
      'User-Agent': 'gdpm-website',
      'Accept': 'application/vnd.github.v3+json',
    }
    const token = getGithubToken()
    if (token) headers.Authorization = `Bearer ${token}`

    try {
      const [list, latest] = await Promise.all([
        fetch(RELEASES_URL, { headers }),
        fetch(LATEST_URL, { headers }),
      ])
      if (!list.ok) throw new Error(`GitHub releases ${list.status}`)
      const releases = await list.json()
      const latestTag = latest.ok
        ? (((await latest.json()) as { tag_name?: string }).tag_name ?? '')
        : ''

      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({ latest: latestTag, releases }))
    } catch (error) {
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }))
    }
  }

  return {
    name: 'gdpm-releases-api',
    configureServer(server) {
      server.middlewares.use('/api/releases', handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/releases', handler)
    },
  }
}

// Mirrors functions/api/docs.ts — same-origin docs proxy so the browser
// never fetches GitHub/jsDelivr directly. raw first (fresh; a 404 there is
// authoritative), jsDelivr only as an availability fallback.
// Dev needs NODE_USE_ENV_PROXY=1 for node fetch to reach the network.
const DOCS_REF = 'dev'
const DOCS_VALID_PATH = /^docs\/[A-Za-z0-9._\-/]+\.(json|md)$/

function docsApi(): Plugin {
  const rawBase = `https://raw.githubusercontent.com/Abyss-PlayerEG/godot-gdpm/${DOCS_REF}/`
  const cdnBase = `https://cdn.jsdelivr.net/gh/Abyss-PlayerEG/godot-gdpm@${DOCS_REF}/`

  const handler = async (req: IncomingMessage, res: ServerResponse) => {
    const path = new URL(req.url ?? '/', 'http://localhost').searchParams.get('path') ?? ''

    const fail = (status: number, error: string) => {
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({ error }))
    }

    if (!DOCS_VALID_PATH.test(path) || path.includes('..')) {
      fail(400, 'invalid path')
      return
    }

    const serve = (body: string) => {
      res.setHeader(
        'Content-Type',
        path.endsWith('.json')
          ? 'application/json; charset=utf-8'
          : 'text/plain; charset=utf-8',
      )
      res.setHeader('Cache-Control', 'public, max-age=300')
      res.end(body)
    }

    let last = 'unreachable'

    try {
      const upstream = await fetch(rawBase + path, { signal: AbortSignal.timeout(10_000) })
      if (upstream.ok) {
        serve(await upstream.text())
        return
      }
      if (upstream.status === 404) {
        fail(404, `404 ← ${rawBase}${path}`)
        return
      }
      last = `${upstream.status} ← raw`
    } catch (e) {
      last = `${e instanceof Error ? e.message : String(e)} ← raw`
    }

    try {
      const upstream = await fetch(cdnBase + path, { signal: AbortSignal.timeout(10_000) })
      if (upstream.ok) {
        serve(await upstream.text())
        return
      }
      last = `${upstream.status} ← cdn (${last})`
    } catch (e) {
      last = `${e instanceof Error ? e.message : String(e)} ← cdn (${last})`
    }

    fail(/404/.test(last) ? 404 : 502, last)
  }

  return {
    name: 'gdpm-docs-api',
    configureServer(server) {
      server.middlewares.use('/api/docs', handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/docs', handler)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), releasesApi(), docsApi()],
  server: {
    host: true,
    port: 8090,
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