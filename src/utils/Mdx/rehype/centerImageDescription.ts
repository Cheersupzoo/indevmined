import { visit } from 'unist-util-visit'

export default function centerImageDescription(_options: any) {
  return async function transformer(tree: any, _file: any) {
    visit(tree, 'element', (node: any, _, parent) => {
      if (node.tagName === 'img') {
        if(parent?.children?.[1] && parent.children[1].type === 'text') {
          const textNode = parent.children[1]
          parent.children[1] = {
            type: 'element',
            tagName: 'span',
            children: [textNode],
          }
        }
      }
    });
  }
}
