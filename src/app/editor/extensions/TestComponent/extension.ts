import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import Component from './index'

export default Node.create({
  name: 'reactComponent',

  group: 'block',

  draggable: true,

  addAttributes() {
    return {
      count: {
        default: 0
      }
    }
  },

  content: 'block*',

  parseHTML() {
    return [
      {
        tag: 'react-component'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['react-component', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component)
  }
})
