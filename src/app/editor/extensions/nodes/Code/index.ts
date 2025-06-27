import { mergeAttributes } from '@tiptap/core'

import { CodeBlockRenderer } from './Component'
import { CodeBased } from './based'

export default CodeBased.extend({
  group: 'block',

  draggable: false,
  defining: true,

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
    return CodeBlockRenderer
  },
})
