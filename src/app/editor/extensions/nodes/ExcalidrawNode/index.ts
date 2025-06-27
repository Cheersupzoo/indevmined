import { mergeAttributes } from '@tiptap/core'

import { ExcalidrawComponentRenderer } from './ExcalidrawComponent'
import { ExcalidrawNodeBased } from './based'

export default ExcalidrawNodeBased.extend({
  name: 'ExcalidrawBlock',

  group: 'block',

  draggable: true,

  content: '',

  parseHTML() {
    return [
      {
        tag: 'excalidraw',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['excalidraw', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ExcalidrawComponentRenderer
  },
})
