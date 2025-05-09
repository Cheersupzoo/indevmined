import { CopyIcon } from 'lucide-react'
import React from 'react'
import { useEditorContext } from '../hooks/EditorProvider'
import { getParentNode } from '@/utils/Tiptap/getParentNodePos'

export const DuplicateNode = () => {
  const { currentEditor } = useEditorContext()

  return (
    <div
      onClick={() => {
        const editor = currentEditor.peek()
        if (!editor) return
        const nodePos = editor.$pos(editor.state.selection.from)
        const parentNodePos = getParentNode(nodePos)
        editor
          .chain()
          .insertContentAt(parentNodePos.to, parentNodePos.node)
          .run()
      }}
      className='p-3'
    >
      <CopyIcon size={16} />
    </div>
  )
}
