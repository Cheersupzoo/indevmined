import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ExcalidrawComponent } from './ExcalidrawComponent'

export default Node.create({
  name: 'ExcalidrawBlock',

  group: 'block',

  draggable: true,

  addAttributes() {
    return {
      state: {
        default: null
      },
      svg: {
        default: null
      }
    }
  },

  content: '',

  parseHTML() {
    return [
      {
        tag: 'excalidraw'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['excalidraw', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ExcalidrawComponent)
  }
})
