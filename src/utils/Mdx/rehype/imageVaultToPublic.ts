import { visit } from 'unist-util-visit'
import fs from 'fs'

export default function imageVaultToPublic(options: any) {
  return async function transformer(tree: any, file: any) {
    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'img' && !node.properties.src.includes('/')) {
        const imgSrc = decodeURIComponent(node.properties.src)
        if (!fs.existsSync(`./public/${imgSrc}`)) {
          try {
            fs.cpSync(`./vault/${imgSrc}`, `./public/${imgSrc}`)
          } catch (error) {
            console.error('[Error] Image not found', `./vault/${imgSrc}`, error)
          }
        }
      }
    })

    visit(tree, 'mdxJsxFlowElement', (node: any) => {
      if (node.name === 'img') {
        const srcNode = node.attributes?.find(
          (attr: any) => attr.name === 'src'
        )
        const src = srcNode?.value
        if (!src || src?.includes('/')) return

        srcNode.value = `/${src}`
        const imgSrc = decodeURIComponent(src)

        if (!fs.existsSync(`./public/${imgSrc}`)) {
          try {
            fs.cpSync(`./vault/${imgSrc}`, `./public/${imgSrc}`)
          } catch (error) {
            console.error('[Error] Image not found', `./vault/${imgSrc}`, error)
          }
        }
      }
    })

    visit(tree, 'mdxJsxTextElement', (node: any) => {
      if (node.name === 'img') {
        const srcNode = node.attributes?.find(
          (attr: any) => attr.name === 'src'
        )
        const src = srcNode?.value
        if (!src || src?.includes('/')) return

        srcNode.value = `/${src}`
        const imgSrc = decodeURIComponent(src)

        if (!fs.existsSync(`./public/${imgSrc}`)) {
          try {
            fs.cpSync(`./vault/${imgSrc}`, `./public/${imgSrc}`)
          } catch (error) {
            console.error('[Error] Image not found', `./vault/${imgSrc}`, error)
          }
        }
      }
    })
  }
}
