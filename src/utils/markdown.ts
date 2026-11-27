import { marked } from 'marked'

/**
 * Markdown pipeline for the docs pages. The source files are written for
 * pymdownx (mkdocs-material); `docs/docs.json` lists every extension in
 * `markdown_extensions`, which doubles as the capability checklist:
 *
 * - tables / superfences … GFM native (marked)
 * - admonition (`!!! note`) … custom extension — added in P3
 * - tabbed (`=== "label"`) … custom extension — added in P3
 * - highlight … highlight.js hook — added in P4
 */

marked.setOptions({ gfm: true, breaks: false })

export function renderMarkdown(text: string): string {
  const html = marked.parse(text, { async: false })
  return typeof html === 'string' ? html : ''
}
