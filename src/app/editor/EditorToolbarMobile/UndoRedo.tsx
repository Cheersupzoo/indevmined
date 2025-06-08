import { cn } from '@/lib/utils'
import { Editor } from '@tiptap/react'
import { Redo2Icon, Undo2Icon } from 'lucide-react'
import React from 'react'

export const UndoRedo = ({ editor }: { editor: Editor }) => {
  return (
    <>
      <button
        className={cn(
          !editor?.can().chain().focus().undo().run() && 'text-eva-text-border'
        )}
        onClick={(e) => {
          e.preventDefault()
          editor?.chain().focus().undo().run()
        }}
        disabled={!editor?.can().chain().focus().undo().run()}
      >
        <Undo2Icon size={16} />
      </button>
      <button
        className={cn(
          !editor?.can().chain().focus().redo().run() && 'text-eva-text-border'
        )}
        onClick={(e) => {
          e.preventDefault()
          editor?.chain().focus().redo().run()
        }}
        disabled={!editor?.can().chain().focus().redo().run()}
      >
        <Redo2Icon size={16} />
      </button>
    </>
  )
}
