import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import { CodeBlock } from './Component'

export default Node.create({
  name: 'CodeBlock',

  group: 'block',

  draggable: false,
  code: true,
  defining: true,

  addAttributes() {
    return {
      lang: {
        default: 'js',
      },
    }
  },

  content: 'text*',

  parseHTML() {
    return [
      {
        tag: 'code-block',
        preserveWhitespace: 'full',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['code-block', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlock)
  },
})
