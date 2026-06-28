export type VersionType = 'stable' | 'dev' | 'alpha' | 'beta' | 'rc'

export function getVersionType(version: string): VersionType {
  if (version.includes('dev')) return 'dev'
  if (version.includes('a') && /\d+a\d+/.test(version)) return 'alpha'
  if (version.includes('b') && /\d+b\d+/.test(version)) return 'beta'
  if (version.includes('rc')) return 'rc'
  return 'stable'
}

export function getVersionBadge(version: string, index: number): { label: string; type: VersionType } | null {
  if (index === 0) {
    const type = getVersionType(version)
    return { label: 'Latest', type }
  }

  const type = getVersionType(version)
  if (type !== 'stable') {
    return { label: type.toUpperCase(), type }
  }

  return null
}

export function getBadgeClass(type: VersionType): string {
  switch (type) {
    case 'stable': return 'badge-stable'
    case 'dev': return 'badge-dev'
    case 'alpha': return 'badge-alpha'
    case 'beta': return 'badge-beta'
    case 'rc': return 'badge-rc'
  }
}
