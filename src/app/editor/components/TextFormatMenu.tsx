import { BubbleMenu, Editor } from '@tiptap/react'
import { findBlockNodeAt } from '../extensions/DragHandleExtension/ProseMirrorPlugin'
import { hideAll } from 'tippy.js'
import { BoldIcon, ItalicIcon, LinkIcon, StrikethroughIcon, UnderlineIcon } from 'lucide-react'
import { openLinkEditor } from '../extensions/LinkExtension'

type TextFormatMenuProps = {
  editor: Editor
}

export const TextFormatMenu = ({ editor }: TextFormatMenuProps) => (
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
      const ignoreBlockNode = ['codeBlock']

      return !ignoreBlockNode.includes(
        state.doc.nodeAt(blockPos)?.type.name ?? 'paragraph'
      )
    }}
    tippyOptions={{ duration: 100 }}
  >
    <div className='bubble-menu'>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <BoldIcon size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <ItalicIcon size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        <StrikethroughIcon size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'is-active' : ''}
      >
        <UnderlineIcon size={16} />
      </button>
      <button
        onClick={() => {
          hideAll()
          openLinkEditor(editor)
        }}
        className={editor.isActive('link') ? 'is-active' : ''}
      >
        <LinkIcon size={16} />
      </button>
    </div>
  </BubbleMenu>
)
