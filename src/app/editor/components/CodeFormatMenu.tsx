import { useEffect } from 'react'

import { Memo, useObservable } from '@legendapp/state/react'
import { BubbleMenu, Editor } from '@tiptap/react'
import { HighlighterIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import { findBlockNodeAt } from '../extensions/functionality/DragHandleExtension/ProseMirrorPlugin'
import { useEditorContext } from '../hooks/EditorProvider'

type CodeFormatMenuProps = {
  editor: Editor
}

const colors = ['gold', 'green', 'blue', 'purple', 'red']
export const CodeFormatMenu = ({ editor }: CodeFormatMenuProps) => {
  const { isActive$ } = useEditorContext()
  const activeColor = useObservable<string | null>(null)

  useEffect(() => {
    const onColorChange = () => {
      const color = editor.isActive('highlightMark')
        ? editor.getAttributes('highlightMark').color
        : null
      activeColor.set(color)
    }

    editor.on('update', onColorChange)
    editor.on('selectionUpdate', onColorChange)
    return () => {
      editor.off('update', onColorChange)
      editor.off('selectionUpdate', onColorChange)
    }
  }, [editor])
  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ state, from, to, editor }) => {
        if (!editor.isEditable || !editor.isFocused) return false
        if (state.selection.$from.depth === 0) return false
        if (from === to) return false

        const blockPos = findBlockNodeAt(state, from)
        if (!blockPos) {
          return true
        }
        const triggerBlockNode = ['codeBlock']

        return triggerBlockNode.includes(
          state.doc.nodeAt(blockPos)?.type.name ?? 'paragraph'
        )
      }}
      tippyOptions={{ duration: 100 }}
    >
      <div className='bubble-menu'>
        <Memo>
          {() => (
            <button
              onClick={() =>
                isActive$.highlightMark.get()
                  ? editor.chain().focus().unsetCodeHighlight().run()
                  : editor.chain().focus().setCodeHighlight().run()
              }
              className={isActive$.highlightMark.get() ? 'is-active' : ''}
            >
              <HighlighterIcon size={16} />
            </button>
          )}
        </Memo>
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => editor.chain().focus().setCodeHighlight(color).run()}
          >
            <Memo>
              {() => (
                <div
                  className={cn(
                    'h-4 w-4 rounded-full bg-zinc-800 outline outline-1 outline-eva-text',
                    activeColor.get() === color && 'outline-blue-400'
                  )}
                >
                  <div
                    className='h-4 w-4 rounded-full'
                    style={{
                      backgroundColor: `rgb(from ${color} r g b / 0.13)`,
                    }}
                  />
                </div>
              )}
            </Memo>
          </button>
        ))}
      </div>
    </BubbleMenu>
  )
}
