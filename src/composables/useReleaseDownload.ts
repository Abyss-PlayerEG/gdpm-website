import { ref, onMounted } from 'vue'
import { getReleaseByVersion, formatSize, formatDate, getPlatform, getArch } from './useGitHubReleases'

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

export function useReleaseDownload(version: string) {
  const release = ref<GitHubRelease | null>(null)
  const assets = ref<GitHubAsset[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  const fetchRelease = () => {
    try {
      loading.value = true
      error.value = null

      // Get release from shared cache
      const data = getReleaseByVersion(version)

      if (!data) {
        error.value = 'Release not found'
        loading.value = false
        return
      }

      release.value = data

      // Filter assets: gdpm prefix + .tar.gz or .zip extension
      const pattern = /^gdpm_.*\.(tar\.gz|zip)$/
      assets.value = data.assets.filter(asset => pattern.test(asset.name))
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchRelease)

  return { release, assets, loading, error, refresh: fetchRelease }
}

export { formatSize, formatDate, getPlatform, getArch }

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
