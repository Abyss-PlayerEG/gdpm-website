import { ref, onMounted, computed } from 'vue'

interface GitHubRelease {
  tag_name: string
  name: string
  prerelease: boolean
  published_at: string
  html_url: string
}

interface CacheData {
  versions: string[]
  timestamp: number
}

const CACHE_KEY = 'gdpm_releases_cache'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

function getCached(): string[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const data: CacheData = JSON.parse(raw)
    if (Date.now() - data.timestamp > CACHE_DURATION) return null
    return data.versions
  } catch {
    return null
  }
}

function setCache(versions: string[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      versions,
      timestamp: Date.now()
    }))
  } catch {
    // ignore
  }
}

export function useGitHubReleases() {
  const versions = ref<string[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  const latestVersion = computed(() => versions.value[0] || '')

  const fetchVersions = async () => {
    // Check cache first
    const cached = getCached()
    if (cached) {
      versions.value = cached
      loading.value = false
      return
    }

    try {
      loading.value = true
      error.value = null

      const response = await fetch(
        'https://api.github.com/repos/Abyss-PlayerEG/godot-gdpm/releases?per_page=100'
      )

      if (!response.ok) {
        throw new Error('Failed to fetch releases')
      }

      const releases: GitHubRelease[] = await response.json()

      // Extract tag names from all releases (including pre-releases)
      versions.value = releases.map(release => release.tag_name.replace('v', ''))

      // Cache the result
      setCache(versions.value)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      console.error('Failed to fetch GitHub releases:', e)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchVersions)

  return { versions, latestVersion, loading, error, refresh: fetchVersions }
}
