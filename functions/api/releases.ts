interface Env {
  GITHUB_TOKEN?: string
}

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

const GITHUB_API = 'https://api.github.com/repos/Abyss-PlayerEG/godot-gdpm/releases'

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const cache = await caches.open('releases-cache');
  const cacheKey = new Request(context.request.url, context.request);
  const cached = await cache.match(cacheKey);

  if (cached) {
    return cached;
  }

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'gdpm-website',
  }

  if (context.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${context.env.GITHUB_TOKEN}`
  }

  try {
    const response = await fetch(`${GITHUB_API}?per_page=100`, { headers })

    if (!response.ok) {
      const errorBody = await response.text()
      return new Response(JSON.stringify({
        error: 'GitHub API error',
        status: response.status,
        message: errorBody,
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const releases: GitHubRelease[] = await response.json()

    const slimmed = releases.map((r) => ({
      tag_name: r.tag_name,
      name: r.name,
      body: r.body,
      prerelease: r.prerelease,
      published_at: r.published_at,
      html_url: r.html_url,
      assets: r.assets.map((a) => ({
        name: a.name,
        browser_download_url: a.browser_download_url,
        size: a.size,
        download_count: a.download_count,
        digest: a.digest,
      })),
    }))

    const responseBody = JSON.stringify(slimmed)

    const resp = new Response(responseBody, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
      },
    })

    context.waitUntil(cache.put(cacheKey, resp.clone()))

    return resp
  } catch (e) {
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: e instanceof Error ? e.message : String(e),
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
