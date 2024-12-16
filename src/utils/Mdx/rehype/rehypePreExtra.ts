import { visit } from 'unist-util-visit'

const fileNameProps = '!'

export default function rehypePreExtra(options: any) {
  return async function transformer(tree: any, file: any) {
    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'pre') {
        const codeNode = node.children?.[0]

        if (codeNode && codeNode.data?.meta && codeNode.properties) {
          const props = (codeNode.data?.meta as string).split(' ')
          const indexNameProps = props.findIndex(
            (prop) => prop === fileNameProps
          )
          if (indexNameProps !== -1 && props[indexNameProps + 1]) {
            node.properties.fileName = props[indexNameProps + 1]
          }
          const ignoreProps = ['!']
          props
            .filter((prop) => !ignoreProps.includes(prop))
            .filter((prop) => !prop.includes('='))
            .forEach((prop) => (node.properties[prop] = true))

          node.properties.meta = codeNode.data?.meta
        }
      }
    })
  }
}
