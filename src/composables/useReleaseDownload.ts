import { ref } from 'vue'

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
  release: GitHubRelease
  timestamp: number
}

const CACHE_PREFIX = 'gdpm_release_'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

function getCached(version: string): { release: GitHubRelease } | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + version)
    if (!raw) return null
    const data: CacheData = JSON.parse(raw)
    if (Date.now() - data.timestamp > CACHE_DURATION) return null
    return { release: data.release }
  } catch {
    return null
  }
}

function setCache(version: string, release: GitHubRelease) {
  try {
    localStorage.setItem(CACHE_PREFIX + version, JSON.stringify({
      release,
      timestamp: Date.now()
    }))
  } catch {
    // ignore
  }
}

export function useReleaseDownload(version: string) {
  const release = ref<GitHubRelease | null>(null)
  const assets = ref<GitHubAsset[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  const fetchRelease = async () => {
    const cached = getCached(version)
    if (cached) {
      release.value = cached.release
      const pattern = /^gdpm_.*\.(tar\.gz|zip)$/
      assets.value = cached.release.assets.filter(asset => pattern.test(asset.name))
      loading.value = false
      return
    }

    try {
      loading.value = true
      error.value = null

      const response = await fetch(
        `https://api.github.com/repos/Abyss-PlayerEG/godot-gdpm/releases/tags/v${version}`
      )

      if (!response.ok) {
        throw new Error('Release not found')
      }

      const data: GitHubRelease = await response.json()
      release.value = data

      const pattern = /^gdpm_.*\.(tar\.gz|zip)$/
      assets.value = data.assets.filter(asset => pattern.test(asset.name))

      setCache(version, data)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  fetchRelease()

  return { release, assets, loading, error, refresh: fetchRelease }
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

export function parseReleaseNotes(body: string): { en: string; zh: string } {
  if (!body) return { en: '', zh: '' }

  const separator = /---\s*\n/

  // Try to find language headers
  const enMatch = body.match(/##\s*English\s*\n([\s\S]*?)(?=---|$)/i)
  const zhMatch = body.match(/##\s*中文\s*\n([\s\S]*?)(?=---|$)/i)

  if (enMatch && zhMatch) {
    return {
      en: enMatch[1].trim(),
      zh: zhMatch[1].trim(),
    }
  }

  // Fallback: split by separator
  const parts = body.split(separator)
  if (parts.length >= 2) {
    return {
      en: parts[0].trim(),
      zh: parts[1].trim(),
    }
  }

  // No separator found, return as English
  return {
    en: body.trim(),
    zh: '',
  }
}
