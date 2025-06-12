import { PanelTopClose } from 'lucide-react'
import React from 'react'
import { useEditorContext } from '../hooks/EditorProvider'

export const NodeUp = () => {
  const { currentEditor } = useEditorContext()

  return (
    <button
      onClick={(e) => {
        const editor = currentEditor.peek()
        if (!editor) return
        e.preventDefault()
        editor.chain().moveBlockUp().focus().run()
      }}
    >
      <PanelTopClose size={16} />
    </button>
  )
}
