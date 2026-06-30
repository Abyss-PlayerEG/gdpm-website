import { ref, onMounted, computed } from 'vue'

interface GitHubAsset {
  name: string
  browser_download_url: string
  size: number
  download_count: number
  digest: string
}

interface GitHubRelease {
  tag_name: string
  name: string
  body: string
  prerelease: boolean
  published_at: string
  html_url: string
  assets: GitHubAsset[]
}

interface CacheData {
  releases: GitHubRelease[]
  timestamp: number
}

const CACHE_KEY = 'gdpm_releases_cache'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

function getCached(): GitHubRelease[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const data: CacheData = JSON.parse(raw)
    if (Date.now() - data.timestamp > CACHE_DURATION) return null
    return data.releases
  } catch {
    return null
  }
}

function setCache(releases: GitHubRelease[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      releases,
      timestamp: Date.now()
    }))
  } catch {
    // ignore
  }
}

// Shared cache for all composables
let cachedReleases: GitHubRelease[] | null = null

export function useGitHubReleases() {
  const versions = ref<string[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  const latestVersion = computed(() => versions.value[0] || '')

  const fetchVersions = async () => {
    // Check memory cache first
    if (cachedReleases) {
      versions.value = cachedReleases.map(r => r.tag_name.replace('v', ''))
      loading.value = false
      return
    }

    // Check localStorage cache
    const cached = getCached()
    if (cached) {
      cachedReleases = cached
      versions.value = cached.map(r => r.tag_name.replace('v', ''))
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
      cachedReleases = releases
      versions.value = releases.map(r => r.tag_name.replace('v', ''))

      // Cache the result
      setCache(releases)
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

export function getReleaseByVersion(version: string): GitHubRelease | null {
  if (!cachedReleases) return null
  return cachedReleases.find(r => r.tag_name === `v${version}`) || null
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function getPlatform(name: string): string {
  if (name.includes('linux')) return 'Linux'
  if (name.includes('macos')) return 'macOS'
  if (name.includes('windows')) return 'Windows'
  return 'Unknown'
}

export function getArch(name: string): string {
  if (name.includes('arm64')) return 'ARM64'
  if (name.includes('amd64')) return 'AMD64'
  return 'Unknown'
}
