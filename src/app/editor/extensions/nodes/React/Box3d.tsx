import { Node, mergeAttributes } from '@tiptap/core'

import { Renderer } from './Renderer'

export const Box3dNode = Node.create({
  name: 'react-component-box3d',
  group: 'block',
  draggable: true,
  content: '',
  atom: true,

  parseHTML() {
    return [
      {
        tag: this.name,
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [this.name, mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return Renderer
  },
})
