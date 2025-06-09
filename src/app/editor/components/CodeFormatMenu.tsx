import { BubbleMenu, Editor } from '@tiptap/react'
import { findBlockNodeAt } from '../extensions/DragHandleExtension/ProseMirrorPlugin'
import { HighlighterIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type CodeFormatMenuProps = {
  editor: Editor
}

export const CodeFormatMenu = ({ editor }: CodeFormatMenuProps) => (
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
      {['gold', 'green', 'blue', 'purple', 'red'].map((color) => (
        <button
          key={color}
          onClick={() => editor.chain().focus().setCodeHighlight(color).run()}
        >
          <div
            className={cn(
              'h-4 w-4 bg-zinc-800 outline outline-1 outline-eva-text rounded-full',
              editor.isActive('highlightMark', { color }) && 'outline-blue-400'
            )}
          >
            <div
              className='h-4 w-4 rounded-full'
              style={{
                backgroundColor: `rgb(from ${color} r g b / 0.13)`
              }}
            />
          </div>
        </button>
      ))}
    </div>
  </BubbleMenu>
)
