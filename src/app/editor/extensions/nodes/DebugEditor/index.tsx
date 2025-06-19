import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import { DebugEditorComponent } from './DebugEditorComponent'
import './debugEditor.css'

export const DebugEditor = Node.create({
  name: 'debugEditor',
  atom: true,
  draggable: true,
  group: 'block',
  parseHTML() {
    return [
      {
        tag: 'div.debug-editor',
      },
    ]
  },
  renderHTML() {
    return ['div', { class: 'debug-editor' }]
  },
  addNodeView() {
    return ReactNodeViewRenderer(DebugEditorComponent)
  },
})
