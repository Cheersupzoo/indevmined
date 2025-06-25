import { Node, mergeAttributes } from '@tiptap/core'

import { TestComponentRenderer } from './index'

export default Node.create({
  name: 'reactComponent',

  group: 'block',

  draggable: true,

  addAttributes() {
    return {
      count: {
        default: 0,
      },
    }
  },

  content: 'block*',

  parseHTML() {
    return [
      {
        tag: 'react-component',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['react-component', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return TestComponentRenderer
  },
})
