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

interface ReleasesPayload {
  latest: string
  releases: GitHubRelease[]
}

interface CacheData extends ReleasesPayload {
  timestamp: number
}

const CACHE_KEY = 'gdpm_releases_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes — release assets/prerelease flags change at publish time

function getCached(): ReleasesPayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const data: CacheData = JSON.parse(raw)
    if (Date.now() - data.timestamp > CACHE_DURATION) return null
    // Legacy entries stored a bare array with no latest designation
    if (typeof data.latest !== 'string' || !Array.isArray(data.releases)) return null
    return { latest: data.latest, releases: data.releases }
  } catch {
    return null
  }
}

function setCache(payload: ReleasesPayload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      ...payload,
      timestamp: Date.now()
    }))
  } catch {
    // ignore
  }
}

// Shared cache for all composables
let cachedPayload: ReleasesPayload | null = null

export async function fetchAndCacheReleases(): Promise<void> {
  // Check memory cache first
  if (cachedPayload) return

  // Check localStorage cache
  const cached = getCached()
  if (cached) {
    cachedPayload = cached
    return
  }

  try {
    const response = await fetch('/api/releases')

    if (!response.ok) {
      throw new Error('Failed to fetch releases')
    }

    const data = await response.json()
    // Tolerate an edge-cached response still shaped as the old bare array
    const payload: ReleasesPayload = Array.isArray(data)
      ? { latest: '', releases: data }
      : {
          latest: typeof data.latest === 'string' ? data.latest : '',
          releases: Array.isArray(data.releases) ? data.releases : [],
        }

    cachedPayload = payload

    // Cache the result
    setCache(payload)
  } catch (e) {
    console.error('Failed to fetch GitHub releases:', e)
    throw e
  }
}

export function useGitHubReleases() {
  const versions = ref<string[]>([])
  const releasesList = ref<GitHubRelease[]>([])
  const latestTag = ref('')
  const loading = ref(true)
  const error = ref<string | null>(null)

  const latestVersion = computed(() => versions.value[0] || '')

  const apply = (payload: ReleasesPayload) => {
    releasesList.value = payload.releases
    versions.value = payload.releases.map(r => r.tag_name.replace('v', ''))
    // GitHub's designation, stripped of the leading v so it lines up with `versions`
    latestTag.value = payload.latest.replace(/^v/, '')
  }

  const fetchVersions = async () => {
    try {
      loading.value = true
      error.value = null

      await fetchAndCacheReleases()
      if (cachedPayload) apply(cachedPayload)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      console.error('Failed to fetch GitHub releases:', e)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchVersions)

  return { versions, releasesList, latestTag, latestVersion, loading, error, refresh: fetchVersions }
}

export function getReleaseByVersion(version: string): GitHubRelease | null {
  if (!cachedPayload) return null
  return cachedPayload.releases.find(r => r.tag_name === `v${version}`) || null
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

const PLATFORM_TOKENS = ['linux', 'macos', 'windows']
const ARCH_TOKENS = ['amd64', 'arm64', 'x86_64', 'aarch64']

export function getVariant(name: string): string {
  const base = name.replace(/\.(tar\.gz|zip)$/, '')
  const segments = base.split('_')
  const last = segments[segments.length - 1] ?? ''
  if (!last || PLATFORM_TOKENS.includes(last) || ARCH_TOKENS.includes(last)) return ''
  const distro = last.match(/^([a-z]+)(\d{2})(\d{2})$/)
  if (distro) return `${distro[1][0].toUpperCase()}${distro[1].slice(1)} ${distro[2]}.${distro[3]}`
  return last
}

export function isPrerelease(version: string): boolean {
  return getReleaseByVersion(version)?.prerelease ?? false
}
