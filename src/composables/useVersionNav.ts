import { ref, watch, type Ref } from 'vue'
import { fetchVersionNav, type DocsSharedConfig, type DocsVersionConfig } from '../utils/docs'

const CACHE_DURATION = 5 * 60 * 1000

interface CachedNav {
  data: DocsVersionConfig
  timestamp: number
}

const navCache = new Map<string, CachedNav>()

export async function loadVersionNav(tag: string): Promise<DocsVersionConfig> {
  const hit = navCache.get(tag)
  if (hit && Date.now() - hit.timestamp < CACHE_DURATION) return hit.data
  const data = await fetchVersionNav(tag)
  navCache.set(tag, { data, timestamp: Date.now() })
  return data
}

export function useVersionNav(
  config: Ref<DocsSharedConfig | null>,
  tag: Ref<string | null>,
): {
  nav: Ref<DocsVersionConfig | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  reload: () => void
} {
  const nav: Ref<DocsVersionConfig | null> = ref(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const nonce = ref(0)
  let epoch = 0

  watch(
    [config, tag, nonce],
    async ([currentConfig, currentTag]) => {
      const current = ++epoch
      if (!currentConfig || !currentTag) {
        nav.value = null
        return
      }
      loading.value = true
      error.value = null
      try {
        const data = await loadVersionNav(currentTag)
        if (current === epoch) nav.value = data
      } catch (e) {
        if (current === epoch) {
          error.value = e instanceof Error ? e.message : String(e)
          nav.value = null
        }
      } finally {
        if (current === epoch) loading.value = false
      }
    },
    { immediate: true },
  )

  // Drop the cached nav (if any) and re-run the load — used by the
  // network-error retry button.
  function reload(): void {
    if (tag.value) navCache.delete(tag.value)
    nonce.value += 1
  }

  return { nav, loading, error, reload }
}
