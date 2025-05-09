import { PanelTopClose } from 'lucide-react'
import React from 'react'
import { useEditorContext } from '../hooks/EditorProvider'

export const NodeUp = () => {
  const { currentEditor } = useEditorContext()

  return (
    <div
      onClick={() => {
        const editor = currentEditor.peek()
        if (!editor) return
        editor.chain().moveBlockUp().run()
      }}
      className='p-3'
    >
      <PanelTopClose size={16} />
    </div>
  )
}
