import { Trash2Icon } from 'lucide-react'
import React from 'react'
import { useEditorContext } from '../hooks/EditorProvider'
import { getParentNode } from '@/utils/Tiptap/getParentNodePos'

export const DeleteNode = () => {
  const { currentEditor } = useEditorContext()

  return (
    <button
      onClick={() => {
        const editor = currentEditor.peek()
        if (!editor) return
        const nodePos = editor.$pos(editor.state.selection.from)
        const parentNodePos = getParentNode(nodePos)
        editor
          .chain()
          .setNodeSelection(parentNodePos.from - 1)
          .deleteSelection()
          .run()
      }}
    >
      <Trash2Icon size={16} />
    </button>
  )
}
