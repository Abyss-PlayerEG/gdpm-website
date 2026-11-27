/**
 * Docs data layer: pure logic over the godot-gdpm repository's `docs/`
 * directory. No Vue, no localStorage — caching lives in the composables,
 * so this module can be verified outside the browser.
 *
 * Layout consumed here:
 * - docs/docs.json                 shared config (source templates, versions, languages)
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

/**
 * Where docs/docs.json itself lives — must be known before the config can
 * be read. Page fetches use the `source.ref` inside the config instead.
 * `ref` stays on `dev` while the docs feature develops so config tweaks on
 * godot-gdpm's dev branch are visible immediately; switch to `main` for
 * production stability once the feature ships.
 */
export const DOCS_BOOTSTRAP = {
  repo: 'Abyss-PlayerEG/godot-gdpm',
  ref: 'dev',
  path: 'docs/docs.json',
} as const

function bootstrapUrls(): DocsTemplates {
  const { repo, ref, path } = DOCS_BOOTSTRAP
  return {
    cdn: `https://cdn.jsdelivr.net/gh/${repo}@${ref}/${path}`,
    raw: `https://raw.githubusercontent.com/${repo}/${ref}/${path}`,
  }
}

export const DOCS_BOOTSTRAP_URLS: DocsTemplates = bootstrapUrls()

// A hung connection must not stall the fallback chain (cdn → raw → …).
const FETCH_TIMEOUT_MS = 10_000

function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match)
}

function repoRoot(config: DocsSharedConfig, kind: keyof DocsTemplates): string {
  const template = config.source.templates[kind]
  const marker = '{version}'
  const idx = template.indexOf(marker)
  if (idx < 0) throw new Error(`docs template missing {version}: ${template}`)
  return fillTemplate(template.slice(0, idx), {
    repo: config.repo,
    ref: config.source.ref,
  })
}

/** URL of a version's self-contained docs.json (…/docs/<tag>/docs.json). */
export function versionConfigUrl(
  config: DocsSharedConfig,
  tag: string,
  kind: keyof DocsTemplates,
): string {
  return `${repoRoot(config, kind)}${tag}/docs.json`
}

/** URL of a markdown page (…/docs/<tag>/<lang>/<file>). */
export function docPageUrl(
  config: DocsSharedConfig,
  tag: string,
  lang: string,
  file: string,
  kind: keyof DocsTemplates,
): string {
  return fillTemplate(config.source.templates[kind], {
    repo: config.repo,
    ref: config.source.ref,
    version: tag,
    lang,
    file,
  })
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

/**
 * Fetch the shared config, jsDelivr first, raw.githubusercontent as fallback.
 * Validation runs *inside* the chain: jsDelivr caches branch files for ~12h,
 * so a stale-but-200 response must fall through to raw, not throw.
 */
export async function fetchSharedConfig(): Promise<DocsSharedConfig> {
  const urls = DOCS_BOOTSTRAP_URLS
  let last = 'unreachable'
  for (const url of [urls.cdn, urls.raw]) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
      if (res.ok) {
        const data: unknown = await res.json()
        if (isValidSharedConfig(data)) return data
        last = `stale/invalid config ← ${url}`
      } else {
        last = `${res.status} ← ${url}`
      }
    } catch (e) {
      last = `${e instanceof Error ? e.message : String(e)} ← ${url}`
    }
  }
  throw new Error(last)
}

/** Fetch one version's docs.json (cdn → raw, validating inside the chain). */
export async function fetchVersionNav(
  config: DocsSharedConfig,
  tag: string,
): Promise<DocsVersionConfig> {
  let last = 'unreachable'
  for (const kind of ['cdn', 'raw'] as const) {
    const url = versionConfigUrl(config, tag, kind)
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
      if (res.ok) {
        const data: unknown = await res.json()
        if (isValidVersionNav(data)) return data
        last = `stale/invalid nav ← ${url}`
      } else {
        last = `${res.status} ← ${url}`
      }
    } catch (e) {
      last = `${e instanceof Error ? e.message : String(e)} ← ${url}`
    }
  }
  throw new Error(last)
}

/**
 * Fetch a markdown page: cdn → raw for the requested language, then the
 * same pair for the default language (mkdocs-i18n style fallback).
 * `page.lang` reports the language that actually resolved.
 */
export async function fetchDocPage(
  config: DocsSharedConfig,
  tag: string,
  lang: string,
  file: string,
): Promise<DocPage> {
  const defaultLang =
    config.languages.find((l) => l.default)?.folder ?? config.languages[0]?.folder ?? 'en'
  const attempts: Array<[string, keyof DocsTemplates]> = [
    [lang, 'cdn'],
    [lang, 'raw'],
  ]
  if (lang !== defaultLang) {
    attempts.push([defaultLang, 'cdn'], [defaultLang, 'raw'])
  }
  let last = 'unreachable'
  for (const [tryLang, kind] of attempts) {
    const url = docPageUrl(config, tag, tryLang, file, kind)
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
      if (res.ok) return { text: await res.text(), lang: tryLang }
      last = `${res.status} ← ${url}`
    } catch (e) {
      last = `${e instanceof Error ? e.message : String(e)} ← ${url}`
    }
  }
  throw new Error(last)
}
