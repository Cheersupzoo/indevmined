import { visit } from 'unist-util-visit'
import type { Nodes } from 'mdast'
import { toMarkdown } from 'mdast-util-to-markdown'
import { mdxToMarkdown } from 'mdast-util-mdx'

export function remarkCodeHikeDirective() {
  return (tree: any) => {
    visit(tree, (node) => {
      if (node.type === 'containerDirective') {
        const tree = {
          type: 'root',
          children: node.children
        }
        const md = toMarkdown(tree as Nodes, { extensions: [mdxToMarkdown()] })
        if (node.name !== 'CodeHike') return
        node.type = 'mdxJsxTextElement'
        node.children = [
          {
            type: 'text',
            value: md
          }
        ]
      }
    })
  }
}
