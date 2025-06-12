import { PanelBottomClose } from 'lucide-react'
import React from 'react'
import { useEditorContext } from '../hooks/EditorProvider'

export const NodeDown = () => {
  const { currentEditor } = useEditorContext()

  return (
    <button
      onClick={(e) => {
        const editor = currentEditor.peek()
        if (!editor) return
        e.preventDefault()
        editor.chain().moveBlockDown().focus().run()
      }}
    >
      <PanelBottomClose size={16} />
    </button>
  )
}
