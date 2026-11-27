import { ref, watch, type Ref } from 'vue'
import { fetchDocPage, type DocPage, type DocsSharedConfig } from '../utils/docs'

// Session-lifetime cache: key = tag/lang/file as *requested*, so a language
// fallback keeps its original key and resolves instantly on revisit.
const pageCache = new Map<string, DocPage>()

export function useDocPage(
  config: Ref<DocsSharedConfig | null>,
  tag: Ref<string | null>,
  lang: Ref<string>,
  file: Ref<string>,
): {
  text: Ref<string>
  resolvedLang: Ref<string>
  loading: Ref<boolean>
  error: Ref<string | null>
  reload: () => void
} {
  const text = ref('')
  const resolvedLang = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)
  const nonce = ref(0)
  let epoch = 0

  watch(
    [config, tag, lang, file, nonce],
    async ([currentConfig, currentTag, currentLang, currentFile]) => {
      const current = ++epoch
      if (!currentConfig || !currentTag) {
        text.value = ''
        resolvedLang.value = ''
        return
      }
      const key = `${currentTag}/${currentLang}/${currentFile}`
      const hit = pageCache.get(key)
      if (hit) {
        text.value = hit.text
        resolvedLang.value = hit.lang
        loading.value = false
        error.value = null
        return
      }
      loading.value = true
      error.value = null
      try {
        const page = await fetchDocPage(
          currentConfig,
          currentTag,
          currentLang,
          currentFile,
        )
        if (current !== epoch) return
        pageCache.set(key, page)
        text.value = page.text
        resolvedLang.value = page.lang
      } catch (e) {
        if (current !== epoch) return
        error.value = e instanceof Error ? e.message : String(e)
        text.value = ''
        resolvedLang.value = ''
      } finally {
        if (current === epoch) loading.value = false
      }
    },
    { immediate: true },
  )

  // Drop the cached entry (if any) and re-run the load — used by the
  // network-error retry button.
  function reload(): void {
    if (tag.value && lang.value && file.value) {
      pageCache.delete(`${tag.value}/${lang.value}/${file.value}`)
    }
    nonce.value += 1
  }

  return { text, resolvedLang, loading, error, reload }
}
