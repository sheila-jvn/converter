#!/usr/bin/env bun

import fs from 'node:fs/promises'
import path from 'node:path'

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png']

const PATH = process.cwd()
const files = await fs.readdir(PATH)

const nonWebpImages = files.filter((file) =>
  IMAGE_EXTENSIONS.includes(path.extname(file))
)

if (nonWebpImages.length === 0) {
  console.log('No images found')
  process.exitCode = 0
}

console.log(
  `Found ${nonWebpImages.length} images: "${nonWebpImages.join(', ')}"`
)

const imagePaths = nonWebpImages.map((file) => path.join(PATH, file))

for (const imagePath of imagePaths) {
  const file = Bun.file(imagePath)

  const { base, name } = path.parse(imagePath)
  const webpFileName = `${name}.webp`
  const webpFilePath = path.join(PATH, webpFileName)

  const process = Bun.spawnSync(['convert', imagePath, webpFilePath])

  if (!process.success) console.log(`Failed to convert "${base}"`)

  console.log(`Converted "${base}" to "${webpFileName}"`)
}
