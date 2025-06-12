import { Editor } from '@tiptap/core'
import { HighlighterIcon, RemoveFormattingIcon } from 'lucide-react'
import React from 'react'
import { ToolbarVerticalDivider } from './ToolbarVerticalDivider'
import { cn } from '@/lib/utils'
import { useEditorContext } from '../hooks/EditorProvider'
import { Memo, use$, useObservable } from '@legendapp/state/react'

const colors = ['gold', 'green', 'blue', 'purple', 'red']

export const IsCodeBlock = ({ editor }: { editor: Editor }) => {
  const { isActive$ } = useEditorContext()
  const activeColor = useObservable<string | null>(null)

  React.useEffect(() => {
    const onColorChange = () => {
      const color = editor.isActive('highlightMark')
        ? editor.getAttributes('highlightMark').color
        : null
      activeColor.set(color)
    }

    editor.on('selectionUpdate', onColorChange)
    editor.on('update', onColorChange)
    return () => {
      editor.off('selectionUpdate', onColorChange)
      editor.off('update', onColorChange)
    }
  }, [editor])

  const codeBlock = use$(isActive$.codeBlock)

  if (!codeBlock) {
    return null
  }

  return (
    <>
      <button
        onClick={() =>
          isActive$.highlightMark.get()
            ? editor.chain().focus().unsetCodeHighlight().run()
            : editor.chain().focus().setCodeHighlight().run()
        }
      >
        <Memo>
          {() =><HighlighterIcon
            size={16}
            className={isActive$.highlightMark.get() ? 'is-active' : ''}
          />}
        </Memo>
      </button>
      {colors.map((color) => {
        return (
          <button
            key={color}
            onClick={() => editor.chain().focus().setCodeHighlight(color).run()}
          >
            <Memo>
              {() =><div
                className={cn(
                  'h-4 w-4 bg-zinc-800 outline outline-1 outline-eva-text rounded-full',
                  activeColor.get() === color && 'outline-blue-400'
                )}
              >
                <div
                  className=' h-4 w-4 rounded-full'
                  style={{
                    backgroundColor: `rgb(from ${color} r g b / 0.13)`
                  }}
                />
              </div>}
            </Memo>
          </button>
        )
      })}
      <ToolbarVerticalDivider />
      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        title='Clear formatting'
      >
        <RemoveFormattingIcon size={16} />
      </button>
    </>
  )
}
