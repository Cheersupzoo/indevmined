import { Node } from '@tiptap/core'
import './debugEditor.css'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { DebugEditorComponent } from './DebugEditorComponent'

export const DebugEditor = Node.create({
  name: 'debugEditor',
  atom: true,
  draggable: true,
  group: 'block',
  parseHTML() {
    return [
      {
        tag: 'div.debug-editor'
      }
    ]
  },
  renderHTML() {
    return ['div', { class: 'debug-editor' }]
  },
  addNodeView() {
    return ReactNodeViewRenderer(DebugEditorComponent)
  }
})
