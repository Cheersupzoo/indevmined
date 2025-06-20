import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import { DebugEditorComponent } from './DebugEditorComponent'
import './debugEditor.css'

export const DebugEditor = Node.create({
  name: 'debugEditor',
  atom: true,
  draggable: true,
  group: 'block',
  addAttributes() {
    return {
      type: {
        default: 1,
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'div.debug-editor',
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'debug-editor' })]
  },
  addNodeView() {
    return ReactNodeViewRenderer(DebugEditorComponent)
  },
})
