import path from 'node:path'
import fs from 'node:fs'

const distDir = path.join(process.cwd(), 'dist')

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir)
}

await Bun.build({
  entrypoints: ['@/index.ts']
})
