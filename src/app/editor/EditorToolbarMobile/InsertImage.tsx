import React from 'react'

import { ImageIcon } from 'lucide-react'

import { useEditorContext } from '../hooks/EditorProvider'

export const InsertImage = () => {
  const { currentEditor } = useEditorContext()

  return (
    <button
      onClick={() => {
        const editor = currentEditor.peek()
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
    </button>
  )
}
