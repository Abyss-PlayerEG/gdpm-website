import { marked, type Token, type Tokens } from 'marked'
import type { RendererThis, TokenizerThis } from 'marked'

/**
 * Markdown pipeline for the docs pages. The sources are written for
 * pymdownx (mkdocs-material); `docs/docs.json` lists every extension in
 * `markdown_extensions`, which doubles as the capability checklist:
 *
 * - admonition (`!!! note "Title"`) … custom block extension (below)
 * - tabbed (`=== "Label"` + indented block) … custom block extension (below)
 * - tables / superfences … GFM native (marked)
 * - highlight … highlight.js hook — added in P4
 */

marked.setOptions({ gfm: true, breaks: false })

// renderMarkdown is synchronous, so a module-level current language is safe.
let currentLang = 'en'

const ADMONITION_TITLES: Record<string, { en: string; zh: string }> = {
  note: { en: 'Note', zh: '注意' },
  warning: { en: 'Warning', zh: '警告' },
  tip: { en: 'Tip', zh: '提示' },
  danger: { en: 'Danger', zh: '危险' },
}

interface AdmonitionToken extends Tokens.Generic {
  type: 'admonition'
  admonitionType: string
  admonitionTitle?: string
  tokens: Token[]
}

interface TabbedToken extends Tokens.Generic {
  type: 'tabbed'
  tabs: Array<{ label: string; tokens: Token[] }>
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

interface IndentedSection {
  /** Lines consumed (leading blanks included), counted from the given array. */
  lineCount: number
  /** Dedented markdown source. */
  content: string
}

/**
 * Read a 4-space indented block, allowing blank lines inside it (blank runs
 * are kept only when indented content follows, so trailing blanks are left
 * for the outer space rule).
 */
function readIndentedSection(lines: string[]): IndentedSection | null {
  let i = 0
  while (i < lines.length && /^\s*$/.test(lines[i])) i += 1
  if (i >= lines.length || !/^ {4}/.test(lines[i])) return null
  const out: string[] = []
  while (i < lines.length) {
    const line = lines[i]
    if (/^ {4}/.test(line)) {
      out.push(line.slice(4))
      i += 1
      continue
    }
    if (/^\s*$/.test(line)) {
      let j = i
      while (j < lines.length && /^\s*$/.test(lines[j])) j += 1
      if (j < lines.length && /^ {4}/.test(lines[j])) {
        while (i < j) {
          out.push('')
          i += 1
        }
        continue
      }
      break
    }
    break
  }
  if (out.length === 0) return null
  return { lineCount: i, content: out.join('\n') }
}

const admonitionExtension = {
  name: 'admonition',
  level: 'block' as const,
  start(src: string): number | void {
    return src.match(/^!!!/m)?.index
  },
  tokenizer(this: TokenizerThis, src: string): Tokens.Generic | undefined {
    const lines = src.split('\n')
    const header = /^!!!(?:\s+([a-zA-Z]+))?(?:\s+"([^"]*)")?[ \t]*$/.exec(lines[0] ?? '')
    if (!header) return undefined
    const section = readIndentedSection(lines.slice(1))
    if (!section) return undefined
    const raw = [lines[0], ...lines.slice(1, 1 + section.lineCount)].join('\n')
    return {
      type: 'admonition',
      raw,
      admonitionType: (header[1] ?? 'note').toLowerCase(),
      admonitionTitle: header[2],
      tokens: this.lexer.blockTokens(section.content, []),
    }
  },
  renderer(this: RendererThis, token: Tokens.Generic): string {
    const t = token as AdmonitionToken
    const fallback =
      ADMONITION_TITLES[t.admonitionType]?.[currentLang === 'zh' ? 'zh' : 'en'] ??
      t.admonitionType.charAt(0).toUpperCase() + t.admonitionType.slice(1)
    const title = t.admonitionTitle ?? fallback
    const titleHtml = `<p class="admonition-title">${escapeHtml(title)}</p>`
    const body = this.parser.parse(t.tokens)
    return `<div class="admonition admonition-${escapeHtml(t.admonitionType)}">${titleHtml}${body}</div>\n`
  },
}

const tabbedExtension = {
  name: 'tabbed',
  level: 'block' as const,
  childTokens: ['tabs'],
  start(src: string): number | void {
    return src.match(/^=== "/m)?.index
  },
  tokenizer(this: TokenizerThis, src: string): Tokens.Generic | undefined {
    const lines = src.split('\n')
    if (!/^===\s+"/.test(lines[0] ?? '')) return undefined
    const tabs: Array<{ label: string; tokens: Token[] }> = []
    let i = 0
    for (;;) {
      const save = i
      while (i < lines.length && /^\s*$/.test(lines[i])) i += 1
      const header = i < lines.length ? /^===\s+"([^"]*)"[ \t]*$/.exec(lines[i]) : null
      if (!header) {
        i = save
        break
      }
      i += 1
      const section = readIndentedSection(lines.slice(i))
      if (!section) {
        i = save
        break
      }
      i += section.lineCount
      tabs.push({ label: header[1], tokens: this.lexer.blockTokens(section.content, []) })
    }
    if (tabs.length === 0) return undefined
    return { type: 'tabbed', raw: lines.slice(0, i).join('\n'), tabs }
  },
  renderer(this: RendererThis, token: Tokens.Generic): string {
    const t = token as TabbedToken
    const nav = t.tabs
      .map(
        (tab, index) =>
          `<button type="button" class="tabbed-tab${index === 0 ? ' active' : ''}" data-tab="${index}">${escapeHtml(tab.label)}</button>`,
      )
      .join('')
    const panes = t.tabs
      .map(
        (tab, index) =>
          `<div class="tabbed-pane${index === 0 ? ' active' : ''}" data-pane="${index}">${this.parser.parse(tab.tokens)}</div>`,
      )
      .join('')
    return `<div class="tabbed"><div class="tabbed-nav">${nav}</div><div class="tabbed-content">${panes}</div></div>\n`
  },
}

const COPY_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1 1 0 0 1 3 21l.003-14c0-.552.45-1 1.006-1zM5.002 8L5 20h10V8zM9 6h8v10h2V4H9z"/></svg>'
const CHECK_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m10 15.17l9.192-9.191l1.414 1.414L10 17.999l-6.364-6.364l1.414-1.414z"/></svg>'

marked.use({
  extensions: [admonitionExtension, tabbedExtension],
  renderer: {
    // Wrap each code block with a copy button (features: content.code.copy).
    // Same icons and behavior as CopyButton.vue — v-html cannot host Vue
    // components, so the click is delegated in MarkdownView.
    code(token: Tokens.Code): string {
      const lang = /^([^\s]*)/.exec(token.lang ?? '')?.[1] ?? ''
      const langClass = lang ? ` class="language-${escapeHtml(lang)}"` : ''
      const body = token.escaped ? token.text : escapeHtml(token.text.replace(/\n$/, ''))
      const label = currentLang === 'zh' ? '复制' : 'Copy'
      return (
        '<div class="md-code">' +
        `<button type="button" class="copy-btn" aria-label="${label}">` +
        `<span class="copy-icon">${COPY_ICON_SVG}</span>` +
        `<span class="check-icon">${CHECK_ICON_SVG}</span>` +
        '</button>' +
        `<pre><code${langClass}>${body}\n</code></pre>` +
        '</div>\n'
      )
    },
    // Scroll container around the table: a display:block table (the usual
    // scroll trick) shrink-wraps its rows, so header/row backgrounds stop
    // short of the card edge on narrow tables.
    table(token: Tokens.Table): string {
      const align = token.align
      const th = token.header
        .map((cell, i) => {
          const style = align[i] ? ` style="text-align:${align[i]}"` : ''
          return `<th${style}>${this.parser.parseInline(cell.tokens)}</th>`
        })
        .join('')
      const body = token.rows
        .map(
          (row) =>
            `<tr>${row
              .map((cell, i) => {
                const style = align[i] ? ` style="text-align:${align[i]}"` : ''
                return `<td${style}>${this.parser.parseInline(cell.tokens)}</td>`
              })
              .join('')}</tr>`,
        )
        .join('')
      return `<div class="md-table"><table><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table></div>\n`
    },
  },
})

export function renderMarkdown(text: string, lang = 'en'): string {
  currentLang = lang
  const html = marked.parse(text, { async: false })
  return typeof html === 'string' ? html : ''
}
