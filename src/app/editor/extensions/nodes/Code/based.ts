import { Node } from '@tiptap/core'

import { CodeStatic } from './static'

export const CodeBased = Node.create({
  name: 'CodeBlock',

  code: true,

  addAttributes() {
    return {
      lang: {
        default: 'js',
      },
    }
  },
  reactNode: CodeStatic,
})
