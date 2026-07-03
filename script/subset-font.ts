import { execSync } from 'child_process'
import { existsSync, mkdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

const INPUT_FONT = join(projectRoot, 'public/fonts/woff2/JetBrainsMono-Regular.woff2')
const OUTPUT_DIR = join(projectRoot, 'public/fonts/woff2')
const OUTPUT_FONT = join(OUTPUT_DIR, 'JetBrainsMono-Regular-subset.woff2')

// ASCII printable characters (0x20-0x7E)
const ASCII_CHARS = Array.from({ length: 95 }, (_, i) => String.fromCharCode(i + 0x20)).join('')

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

function main() {
  if (!existsSync(INPUT_FONT)) {
    console.error(`Input font not found: ${INPUT_FONT}`)
    process.exit(1)
  }

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const inputSize = statSync(INPUT_FONT).size
  console.log(`Input: ${INPUT_FONT} (${formatBytes(inputSize)})`)

  const chars = ASCII_CHARS.replace(/"/g, '\\"').replace(/\\/g, '\\\\')
  const cmd = `pyftsubset "${INPUT_FONT}" --output-file="${OUTPUT_FONT}" --unicodes="U+0020-007E" --flavor=woff2 --layout-features='*'`

  console.log('Subsetting font...')
  execSync(cmd, { stdio: 'inherit' })

  const outputSize = statSync(OUTPUT_FONT).size
  const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1)

  console.log(`\nOutput: ${OUTPUT_FONT} (${formatBytes(outputSize)})`)
  console.log(`Reduction: ${reduction}%`)
  console.log(`Characters: ${ASCII_CHARS.length} (ASCII printable)`)
}

main()
