export function getOS(): string {
  const ua = navigator.userAgent
  if (ua.includes('Win')) return 'windows'
  if (ua.includes('Mac') && !ua.includes('like Mac')) return 'macos'
  if (ua.includes('Android') || ua.includes('like Mac') || ua.includes('iPad')) return 'mobile'
  if (ua.includes('Linux')) return 'linux'
  return 'unknown'
}

export function getOSDisplayName(os: string): string {
  switch (os) {
    case 'windows': return 'Windows'
    case 'macos': return 'macOS'
    case 'linux': return 'Linux'
    case 'mobile': return 'Mobile'
    default: return 'Unknown'
  }
}

export function getOSIcon(os: string): string {
  switch (os) {
    case 'windows': return 'ri:windows-fill'
    case 'macos': return 'ri:apple-fill'
    case 'linux': return 'devicon-plain:linux'
    default: return 'ic:baseline-download'
  }
}
