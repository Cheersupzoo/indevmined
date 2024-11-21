import { visit } from 'unist-util-visit'

function removeFirstLastLines(str: string) {
  const lines = str.split('\n')
  return lines.slice(1, -1).join('\n')
}

export function remarkCodeHikeDirective() {
  return (tree: any, vFile: { value: string }) => {
    visit(tree, (node) => {
      if (node.type === 'containerDirective' && node.name === 'CodeHike') {
        const originalMdx = vFile.value
        const chPartMdx = removeFirstLastLines(
          originalMdx.slice(
            node.position.start.offset,
            node.position.end.offset
          )
        )

        node.type = 'mdxJsxTextElement'
        node.children = [
          {
            type: 'text',
            value: chPartMdx
          }
        ]
      }
    })
  }
}
