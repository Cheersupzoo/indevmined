import { Editor, EditorEvents } from '@tiptap/core'
import { Transaction } from '@tiptap/pm/state'
import React, { useEffect, useState } from 'react'

export const CursorInfo = ({ editor }: { editor: Editor }) => {
  const [position, setPosition] = useState({ from: 0, to: 0, sharedDepth: 0 })
  useEffect(() => {
    const fn = ({ editor }: { editor: Editor; transaction: Transaction }) => {
      setPosition({
        from: editor.view.state.selection.from,
        to: editor.view.state.selection.to,
        sharedDepth: editor.view.state.selection.$from.sharedDepth(
          editor.view.state.selection.to
        )
      })
    }
    editor.on('transaction', fn)

    return () => {
      editor.off('transaction', fn)
    }
  }, [editor])

  return (
    <div className='fixed top-0 right-0 bg-white text-black'>
      <div>
        From {position.from} To {position.to}
      </div>
      <div>SharedDepth {position.sharedDepth}</div>
    </div>
  )
}
