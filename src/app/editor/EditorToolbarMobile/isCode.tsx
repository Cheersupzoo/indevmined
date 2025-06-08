import { Editor } from '@tiptap/core'
import { HighlighterIcon } from 'lucide-react'
import React from 'react'
import { ToolbarVerticalDivider } from './ToolbarVerticalDivider'
import { cn } from '@/lib/utils'

export const IsCodeBlock = ({ editor }: { editor: Editor }) => {
  if (!editor.isActive('codeBlock')) {
    return <></>
  }

  return (
    <>
      <button
        onClick={() =>
          editor.isActive('highlightMark')
            ? editor.chain().focus().unsetCodeHighlight().run()
            : editor.chain().focus().setCodeHighlight().run()
        }
        className={editor.isActive('highlightMark') ? 'is-active' : ''}
      >
        <HighlighterIcon size={16} />
      </button>
      {['gold', 'green', 'blue', 'purple', 'red'].map((color) => {
        return (
          <button
            key={color}
            onClick={() => editor.chain().focus().setCodeHighlight(color).run()}
          >
            <div
              className={cn(
                'h-4 w-4 bg-zinc-800 outline outline-1 outline-eva-text rounded-full',
                editor.isActive('highlightMark', { color }) &&
                  'outline-blue-400'
              )}
            >
              <div
                className=' h-4 w-4 rounded-full'
                style={{
                  backgroundColor: `rgb(from ${color} r g b / 0.13)`
                }}
              />
            </div>
          </button>
        )
      })}
      <ToolbarVerticalDivider />
    </>
  )
}
