import fs from 'fs'
import path from 'path'
import sizeOf from 'image-size'
import { visit } from 'unist-util-visit'

const blogImagePath = '.cache/imageMap.json'

export default imageSizeEmbedder

function imageSizeEmbedder(options: any) {
  return transformer

  async function transformer(tree: any, file: any) {
    const imgUrls: string[] = []
    let imgCache: { [url: string]: { width?: number; height?: number } } = {}

    if (fs.existsSync(blogImagePath)) {
      imgCache = JSON.parse(fs.readFileSync(blogImagePath, 'utf-8'))
    }

    visit(tree, 'element', visitorGrabUrl)
    await Promise.all(
      imgUrls.map(async (url) => {
        if (imgCache[url]) {
          return
        }
        try {
          const dimensions = sizeOf(path.join('public', url))

          imgCache[url] = {
            height: dimensions.height,
            width: dimensions.width
          }
        } catch (error) {
          console.error('Fail to cache blog image', error)
        }
      })
    )

    fs.writeFileSync(blogImagePath, JSON.stringify(imgCache), 'utf-8')

    visit(tree, 'element', visitor)

    function visitorGrabUrl(node: any) {
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
    function visitor(node: any) {
      if (node.tagName === 'img') {
        const src = node.properties.src

        if (imgCache[src]) {
          const dimensions = imgCache[src]
          node.properties.width = dimensions.width
          node.properties.height = dimensions.height
        }
      }
    }
  }
   
}
