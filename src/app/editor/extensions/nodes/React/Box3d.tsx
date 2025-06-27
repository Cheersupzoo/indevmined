import { mergeAttributes } from '@tiptap/core'

import { Renderer } from './Renderer'
import { Box3dNodeBased } from './based'

export const Box3dNode = Box3dNodeBased.extend({
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
