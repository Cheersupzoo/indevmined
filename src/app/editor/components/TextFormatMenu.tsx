import { BubbleMenu, Editor } from '@tiptap/react'
import { findBlockNodeAt } from '../extensions/DragHandleExtension/ProseMirrorPlugin'
import { hideAll } from 'tippy.js'
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  LinkIcon,
  StrikethroughIcon,
  UnderlineIcon
} from 'lucide-react'
import { openLinkEditor } from '../extensions/LinkExtension'
import { useEditorContext } from '../hooks/EditorProvider'
import { Memo } from '@legendapp/state/react'

type TextFormatMenuProps = {
  editor: Editor
}

export const TextFormatMenu = ({ editor }: TextFormatMenuProps) => {
  const { isActive$ } = useEditorContext()

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
        const ignoreBlockNode = ['codeBlock']

        return !ignoreBlockNode.includes(
          state.doc.nodeAt(blockPos)?.type.name ?? 'paragraph'
        )
      }}
      tippyOptions={{ duration: 100 }}
    >
      <div className='bubble-menu'>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          <Memo>
            {() => (
              <BoldIcon
                size={16}
                className={isActive$.bold.get() ? 'is-active' : ''}
              />
            )}
          </Memo>
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Memo>
            {() => (
              <ItalicIcon
                size={16}
                className={isActive$.italic.get() ? 'is-active' : ''}
              />
            )}
          </Memo>
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Memo>
            {() => (
              <StrikethroughIcon
                size={16}
                className={isActive$.strike.get() ? 'is-active' : ''}
              />
            )}
          </Memo>
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <Memo>
            {() => (
              <UnderlineIcon
                size={16}
                className={isActive$.underline.get() ? 'is-active' : ''}
              />
            )}
          </Memo>
        </button>
        <button onClick={() => editor.chain().focus().toggleCode().run()}>
          <Memo>
            {() => (
              <CodeIcon
                size={16}
                className={isActive$.code.get() ? 'is-active' : ''}
              />
            )}
          </Memo>
        </button>
        <button
          onClick={() => {
            hideAll()
            openLinkEditor(editor)
          }}
        >
          <Memo>
            {() => (
              <LinkIcon
                size={16}
                className={isActive$.link.get() ? 'is-active' : ''}
              />
            )}
          </Memo>
        </button>
      </div>
    </BubbleMenu>
  )
}
