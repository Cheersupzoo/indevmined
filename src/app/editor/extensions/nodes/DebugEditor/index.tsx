import { mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import { DebugEditorComponent } from './DebugEditorComponent'
import { DebugEditorBased } from './based'

export const DebugEditor = DebugEditorBased.extend({
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
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'debug-editor' })]
  },
  addNodeView() {
    return ReactNodeViewRenderer(DebugEditorComponent, { className: '-mx-3' })
  },
})
