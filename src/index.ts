import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

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

const imagePromises = imagePaths.map(async (imagePath) => {
  const file = Bun.file(imagePath)

  const buffer = await file.arrayBuffer()
  const result = await sharp(buffer).webp().toBuffer()

  const { base, name } = path.parse(imagePath)
  const webpFileName = `${name}.webp`
  const webpFilePath = path.join(PATH, webpFileName)

  await Bun.write(webpFilePath, result)

  console.log(`Converted "${base}" to "${webpFileName}"`)
})

await Promise.all(imagePromises)
