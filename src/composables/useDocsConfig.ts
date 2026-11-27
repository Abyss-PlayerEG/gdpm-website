import { onMounted, ref, type Ref } from 'vue'
import { fetchSharedConfig, type DocsSharedConfig } from '../utils/docs'

const CACHE_KEY = 'gdpm_docs_config_cache'
const CACHE_DURATION = 5 * 60 * 1000

interface CachedConfig {
  data: DocsSharedConfig
  timestamp: number
}

// Module-level singleton: every consumer shares one request and one cache.
let loaded: DocsSharedConfig | null = null
let inflight: Promise<DocsSharedConfig | null> | null = null
const config: Ref<DocsSharedConfig | null> = ref(null)
const loading = ref(false)
const error = ref<string | null>(null)

function readCache(): DocsSharedConfig | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached: CachedConfig = JSON.parse(raw)
    if (Date.now() - cached.timestamp > CACHE_DURATION) return null
    const data = cached.data
    if (
      !data ||
      typeof data.repo !== 'string' ||
      typeof data.source?.ref !== 'string' ||
      !Array.isArray(data.versions) ||
      !Array.isArray(data.languages)
    ) {
      return null
    }
    return data
  } catch {
    return null
  }
}

function writeCache(data: DocsSharedConfig): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {
    // Storage unavailable or full — the memory cache still serves this session.
  }
}

async function doLoad(): Promise<DocsSharedConfig | null> {
  const cached = readCache()
  if (cached) {
    loaded = cached
    config.value = cached
    return cached
  }
  loading.value = true
  error.value = null
  try {
    const data = await fetchSharedConfig()
    loaded = data
    config.value = data
    writeCache(data)
    return data
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    return null
  } finally {
    loading.value = false
  }
}

export async function loadDocsConfig(): Promise<DocsSharedConfig | null> {
  if (loaded) return loaded
  if (inflight) return inflight
  inflight = doLoad()
  try {
    return await inflight
  } finally {
    inflight = null
  }
}

export function useDocsConfig(): {
  config: Ref<DocsSharedConfig | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  reload: () => Promise<DocsSharedConfig | null>
} {
  onMounted(() => {
    void loadDocsConfig()
  })
  return { config, loading, error, reload: loadDocsConfig }
}
