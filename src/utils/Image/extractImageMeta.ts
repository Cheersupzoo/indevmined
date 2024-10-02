import sharp from 'sharp'
export default async function extractImageMeta(
  input: Parameters<typeof import('sharp')>[0]
) {
  const image = sharp(input).rotate()
  const metadata = await image.metadata()

  const {dominant} = await image.stats()

  return {
    width: metadata.width,
    height: metadata.height,
    dominant
  }
}
