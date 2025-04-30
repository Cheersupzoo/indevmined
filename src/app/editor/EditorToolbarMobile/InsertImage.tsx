import { ImageIcon } from 'lucide-react'
import React from 'react'
import { useEditorContext } from '../hooks/EditorProvider'

export const InsertImage = () => {
  const { currentEditor } = useEditorContext()

  return (
    <div
      className='p-3'
      onClick={() => {
        const editor = currentEditor.current
        if (!editor) return

        const url = window.prompt('URL')

        if (url) {
          editor
            .chain()
            .focus()
            .deleteRange(editor.state.selection)
            .setImage({ src: url })
            .run()
        }
      }}
    >
      <ImageIcon size={16} />
    </div>
  )
}
