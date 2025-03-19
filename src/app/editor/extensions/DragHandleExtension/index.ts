import { Extension } from '@tiptap/core'
import { dragHandlePlugin } from './ProseMirrorPlugin'

export const DragHandle = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    return [dragHandlePlugin()]
  }
})
