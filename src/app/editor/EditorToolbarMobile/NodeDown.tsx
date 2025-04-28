import { PanelBottomClose } from 'lucide-react'
import React from 'react'
import { useEditorContext } from '../hooks/EditorProvider'

export const NodeDown = () => {
  const { currentEditor } = useEditorContext()

  return (
    <div
      onClick={() => {
        const editor = currentEditor.current
        if (!editor) return
        editor.chain().moveBlockDown().run()
      }}
      className='p-3'
    >
      <PanelBottomClose size={16} />
    </div>
  )
}
