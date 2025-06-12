import { cn } from '@/lib/utils'
import { Memo, useObservable } from '@legendapp/state/react'
import { Editor, EditorEvents } from '@tiptap/react'
import { Redo2Icon, Undo2Icon } from 'lucide-react'
import React, { useEffect } from 'react'

export const UndoRedo = ({ editor }: { editor: Editor }) => {
  const canUndo = useObservable(false)
  const canRedo = useObservable(false)

  useEffect(() => {
    const onUndoChange = ({ editor }: EditorEvents['transaction']) => {
      canUndo.set(editor.can().chain().focus().undo().run())
    }
    const onRedoChange = ({ editor }: EditorEvents['transaction']) => {
      canRedo.set(editor.can().chain().focus().redo().run())
    }
    editor.on('transaction', onUndoChange)
    editor.on('transaction', onRedoChange)
    return () => {
      editor.off('transaction', onUndoChange)
      editor.off('transaction', onRedoChange)
    }
  }, [editor])

  return (
    <>
      <Memo>
        {() => (
          <button
            className={cn(!canUndo.get() && 'text-eva-text-border')}
            onClick={(e) => {
              e.preventDefault()
              editor?.chain().focus().undo().run()
            }}
            disabled={!canUndo.get()}
          >
            <Undo2Icon size={16} />
          </button>
        )}
      </Memo>
      <Memo>
        {() => (
          <button
            className={cn(!canRedo.get() && 'text-eva-text-border')}
            onClick={(e) => {
              e.preventDefault()
              editor?.chain().focus().redo().run()
            }}
            disabled={!canRedo.get()}
          >
            <Redo2Icon size={16} />
          </button>
        )}
      </Memo>
    </>
  )
}
