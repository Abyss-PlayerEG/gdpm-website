interface Env {
  GITHUB_TOKEN?: string
}

/**
 * Same-origin docs proxy — mirrors the /api/releases pattern so the
 * browser never talks to GitHub/jsDelivr directly (no CORS, no
 * client-side proxy quirks, one place for caching).
 *
 * Fetch order: raw.githubusercontent first (always fresh — a 404 there
 * is authoritative and returns immediately), jsDelivr only as an
 * availability fallback when raw is unreachable (may serve branch-cached
 * content, but better than a hard failure).
 */

const DOCS_REF = 'dev'
const RAW_BASE = `https://raw.githubusercontent.com/Abyss-PlayerEG/godot-gdpm/${DOCS_REF}/`
const CDN_BASE = `https://cdn.jsdelivr.net/gh/Abyss-PlayerEG/godot-gdpm@${DOCS_REF}/`

const VALID_PATH = /^docs\/[A-Za-z0-9._\-/]+\.(json|md)$/

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

function serve(body: string, path: string): Response {
  return new Response(body, {
    headers: {
      'Content-Type': path.endsWith('.json')
        ? 'application/json; charset=utf-8'
        : 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=1800',
    },
  })
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const path = url.searchParams.get('path') ?? ''

  if (!VALID_PATH.test(path) || path.includes('..')) {
    return jsonResponse(400, { error: 'invalid path' })
  }

  let last = 'unreachable'

  try {
    const res = await fetch(RAW_BASE + path, {
      cf: { cacheTtl: 300 },
      signal: AbortSignal.timeout(10_000),
    })
    if (res.ok) return serve(await res.text(), path)
    // raw is the source of truth: a 404 there means the file is gone
    // (do not fall back to a possibly stale CDN copy of a deleted file)
    if (res.status === 404) return jsonResponse(404, { error: `404 ← ${RAW_BASE}${path}` })
    last = `${res.status} ← raw`
  } catch (e) {
    last = `${e instanceof Error ? e.message : String(e)} ← raw`
  }

  try {
    const res = await fetch(CDN_BASE + path, {
      cf: { cacheTtl: 300 },
      signal: AbortSignal.timeout(10_000),
    })
    if (res.ok) return serve(await res.text(), path)
    last = `${res.status} ← cdn (${last})`
  } catch (e) {
    last = `${e instanceof Error ? e.message : String(e)} ← cdn (${last})`
  }

  return jsonResponse(/404/.test(last) ? 404 : 502, { error: last })
}
