import { useEffect } from 'react'

import { Memo, useObservable } from '@legendapp/state/react'
import { BubbleMenu, Editor } from '@tiptap/react'
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  LinkIcon,
  OrigamiIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react'
import { hideAll } from 'tippy.js'

import { cn } from '@/lib/utils'

import { findBlockNodeAt } from '../extensions/functionality/DragHandleExtension/ProseMirrorPlugin'
import { openLinkEditor } from '../extensions/marks/LinkExtension'
import { useEditorContext } from '../hooks/EditorProvider'

type TextFormatMenuProps = {
  editor: Editor
}

export const TextFormatMenu = ({ editor }: TextFormatMenuProps) => {
  const { isActive$ } = useEditorContext()
  const activeColor = useObservable<number | null>(null)

  useEffect(() => {
    const onColorChange = () => {
      const num = editor.isActive('textDecorationMark')
        ? editor.getAttributes('textDecorationMark').num
        : null
      activeColor.set(num)
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
        const ignoreBlockNode = ['codeBlock']

        return !ignoreBlockNode.includes(
          state.doc.nodeAt(blockPos)?.type.name ?? 'paragraph'
        )
      }}
      tippyOptions={{ duration: 100, maxWidth: 'none' }}
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
        <button onClick={() => editor.chain().focus().togglePlayful().run()}>
          <Memo>
            {() => (
              <div
                className={cn(
                  'playful',
                  isActive$.playful.get() ? 'is-active' : ''
                )}
              >
                P
              </div>
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
        <div className='mx-1 inline-block h-6 w-[1px] bg-eva-text-border' />
        <button
          className='font-bold'
          onClick={() => editor.chain().focus().unsetTextDecoration().run()}
        >
          A
        </button>
        {[1, 2, 3, 4, 5].map((num) => (
          <Memo key={num}>
            {() => (
              <button
                className={cn(
                  activeColor.get() === num
                    ? 'is-active outline outline-2 -outline-offset-2 outline-eva-text-border'
                    : ''
                )}
                onClick={() =>
                  editor.chain().focus().setTextDecoration(num).run()
                }
              >
                <span
                  className='text-decoration font-bold'
                  style={{
                    color: `rgb(var(--color${num}))`,
                  }}
                >
                  A
                </span>
              </button>
            )}
          </Memo>
        ))}
        <div className='mx-1 inline-block h-6 w-[1px] bg-eva-text-border' />
        <button onClick={() => editor.chain().focus().toggleAnimation().run()}>
          <Memo>
            {() => (
              <OrigamiIcon
                size={16}
                className={isActive$.animation.get() ? 'is-active' : ''}
              />
            )}
          </Memo>
        </button>
      </div>
    </BubbleMenu>
  )
}
