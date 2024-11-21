import { visit } from 'unist-util-visit'

export default function rehypePreExtra(options: any) {
  return async function transformer(tree: any, file: any) {
    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'pre') {
        const codeNode = node.children?.[0]

        if (codeNode && codeNode.data?.meta && codeNode.properties) {
          const props = (codeNode.data?.meta as string).split(' ')
          const ignoreProps = ['!']
          props
            .filter((prop) => !ignoreProps.includes(prop))
            .filter((prop) => !prop.includes('='))
            .forEach((prop) => (node.properties[prop] = true))
        }
      }
    })
  }
}
