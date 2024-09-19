import extractImageMeta from '@/utils/Image/extractImageMeta'
import fs from 'fs'
import path from 'path'
import { visit } from 'unist-util-visit'

const blogImagePath = '.cache/imageMap.json'

export default imageSizeEmbedder

function imageSizeEmbedder() {
  return transformer

  async function transformer(tree: any) {
    const imgUrls: string[] = []
    let imgCache: {
      [url: string]: {
        width?: number
        height?: number
        dominant: {
          r: number
          g: number
          b: number
        }
      }
    } = {}

    if (fs.existsSync(blogImagePath)) {
      imgCache = JSON.parse(fs.readFileSync(blogImagePath, 'utf-8'))
    }

    visit(tree, 'element', imgUrlGrabVisitor)

    function imgUrlGrabVisitor(node: any) {
      if (node.tagName === 'img') {
        const src = node.properties.src
        if (src.startsWith('http')) {
          return
        }
        if (src.startsWith('/')) {
          return imgUrls.push(src)
        }
      }
    }

    await Promise.all(
      imgUrls.map(async (url) => {
        if (imgCache[url]) {
          return
        }
        try {
          const result = await extractImageMeta(path.join('public', url))

          imgCache[url] = result
        } catch (error) {
          console.error('Fail to cache blog image', error)
        }
      })
    )

    fs.writeFileSync(blogImagePath, JSON.stringify(imgCache), 'utf-8')

    visit(tree, 'element', applyImgMetaVisitor)

    function applyImgMetaVisitor(node: any) {
      if (node.tagName === 'img') {
        const src = node.properties.src

        if (imgCache[src]) {
          const { width, height, dominant } = imgCache[src]

          node.properties.width = width
          node.properties.height = height
          node.properties.style = `background: rgb(${dominant.r}, ${dominant.g}, ${dominant.b});`
        }
      }
    }
  }
}
