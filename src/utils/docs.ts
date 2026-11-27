/**
 * Docs data layer: fetches the godot-gdpm repository's `docs/` directory
 * through the same-origin `/api/docs` proxy — the same pattern as
 * `/api/releases`, so the browser never talks to GitHub/jsDelivr directly
 * (no CORS, no client-side proxy quirks; the server side owns upstream
 * selection and caching). No Vue, no localStorage here — caching lives in
 * the composables, so this module can be verified outside the browser.
 *
 * Layout consumed (repo-relative paths passed to the proxy):
 * - docs/docs.json                 shared config (versions, languages, …)
 * - docs/<tag>/docs.json           self-contained version nav (bilingual labels)
 * - docs/<tag>/<lang>/<file>.md    pages
 */

export interface DocsTemplates {
  cdn: string
  raw: string
}

export interface DocsSource {
  ref: string
  templates: DocsTemplates
}

export interface DocsLanguage {
  folder: string
  locale: string
  name: string
  default: boolean
}

export interface DocsSharedConfig {
  name: string
  description: string
  repo: string
  source: DocsSource
  versions: string[]
  languages: DocsLanguage[]
  markdown_extensions: unknown[]
  features: string[]
}

export interface DocsNavEntry {
  file: string
  label: Record<string, string>
}

export interface DocsVersionConfig {
  version: string
  tag: string
  nav: DocsNavEntry[]
}

export interface DocPage {
  text: string
  lang: string
}

// A hung connection must not stall the request (the proxy has its own
// upstream timeout; this one guards the same-origin hop too).
const FETCH_TIMEOUT_MS = 10_000

function docsUrl(path: string): string {
  return `/api/docs?path=${encodeURIComponent(path)}`
}

async function fetchDocs(path: string): Promise<string> {
  const url = docsUrl(path)
  let res: Response
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
  } catch (e) {
    throw new Error(`${e instanceof Error ? e.message : String(e)} ← ${url}`, { cause: e })
  }
  if (!res.ok) throw new Error(`${res.status} ← ${url}`)
  return res.text()
}

function isValidSharedConfig(data: unknown): data is DocsSharedConfig {
  const c = data as DocsSharedConfig | null
  return (
    !!c &&
    typeof c === 'object' &&
    typeof c.repo === 'string' &&
    !!c.source &&
    typeof c.source.ref === 'string' &&
    !!c.source.templates?.cdn &&
    !!c.source.templates?.raw &&
    Array.isArray(c.versions) &&
    Array.isArray(c.languages)
  )
}

function isValidVersionNav(data: unknown): data is DocsVersionConfig {
  const nav = data as DocsVersionConfig | null
  return !!nav && typeof nav === 'object' && Array.isArray(nav.nav)
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown
  } catch {
    return null
  }
}

/** Fetch the shared config through the docs proxy, shape-validated. */
export async function fetchSharedConfig(): Promise<DocsSharedConfig> {
  const data = parseJson(await fetchDocs('docs/docs.json'))
  if (!isValidSharedConfig(data)) throw new Error('stale/invalid config')
  return data
}

/** Fetch one version's docs.json through the docs proxy, shape-validated. */
export async function fetchVersionNav(tag: string): Promise<DocsVersionConfig> {
  const data = parseJson(await fetchDocs(`docs/${tag}/docs.json`))
  if (!isValidVersionNav(data)) throw new Error('stale/invalid nav')
  return data
}

/**
 * Fetch a markdown page: the requested language first, then the default
 * language (mkdocs-i18n style fallback). `page.lang` reports the language
 * that actually resolved.
 */
export async function fetchDocPage(
  config: DocsSharedConfig,
  tag: string,
  lang: string,
  file: string,
): Promise<DocPage> {
  const defaultLang =
    config.languages.find((l) => l.default)?.folder ?? config.languages[0]?.folder ?? 'en'
  const attempts = lang !== defaultLang ? [lang, defaultLang] : [lang]
  let last = 'unreachable'
  for (const tryLang of attempts) {
    try {
      const text = await fetchDocs(`docs/${tag}/${tryLang}/${file}`)
      return { text, lang: tryLang }
    } catch (e) {
      last = e instanceof Error ? e.message : String(e)
    }
  }
  throw new Error(last)
}
