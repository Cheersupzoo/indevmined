import { PanelTopClose } from 'lucide-react'
import React from 'react'
import { useEditorContext } from '../hooks/EditorProvider'

export const NodeUp = () => {
  const { currentEditor } = useEditorContext()

  return (
    <button
      onClick={() => {
        const editor = currentEditor.peek()
        if (!editor) return
        editor.chain().moveBlockUp().run()
      }}
    >
      <PanelTopClose size={16} />
    </button>
  )
}
