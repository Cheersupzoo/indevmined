import { useEffect } from 'react'

import { Editor } from '@tiptap/core'

import { findBlockNodeAt } from '../extensions/functionality/DragHandleExtension/ProseMirrorPlugin'

/**
 * @description Long touch to select node
 */
export const useLongTouch = (editor: Editor) => {
  useEffect(() => {
    const touchStart = (e: TouchEvent) => {
      if (!editor.isEditable) return
      if (editor.view.dom.contains(e.target as Node)) {
        if (
          (e.target as HTMLElement).closest('.ProseMirror-selectednode') ||
          e.touches.length !== 1
        )
          return

        const pos = editor.view.posAtCoords({
          left: e.touches[0].clientX,
          top: e.touches[0].clientY,
        })

        if (!pos || pos.inside < 0 || pos.pos === pos.inside) return
        const $pos = editor.state.doc.resolve(pos.pos)
        if (pos.pos !== $pos.end()) return

        e.preventDefault()
        e.stopPropagation()

        const blockNodePos = findBlockNodeAt(editor.state, pos.pos)
        if (typeof blockNodePos !== 'number') return
        const node = editor.state.doc.nodeAt(blockNodePos)
        if (!node) return
        let timeout: string
        const cancel = () => {
          clearTimeout(timeout)
          document.removeEventListener('touchmove', cancel)
          document.removeEventListener('touchend', cancel)
          document.removeEventListener('touchcancel', cancel)
        }
        timeout = setTimeout(() => {
          editor.chain().focus().setNodeSelection(blockNodePos!).run()
          cancel()
        }, 1000) as unknown as string

        document.addEventListener('touchmove', cancel)
        document.addEventListener('touchend', cancel)
        document.addEventListener('touchcancel', cancel)
        return false
      }
    }
    document.addEventListener('touchstart', touchStart)

    return () => {
      document.removeEventListener('touchstart', touchStart)
    }
  })
}
