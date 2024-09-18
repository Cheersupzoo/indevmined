import { visit } from 'unist-util-visit'

export default function imageUrlTransformer(options: any) {
  return async function transformer(tree: any, file: any) {
    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'img' && !node.properties.src.includes('/')) {
        node.properties.src = `/${node.properties.src}`;
      }
    });
  }
}
