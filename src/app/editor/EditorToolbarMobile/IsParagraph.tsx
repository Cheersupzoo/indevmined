import React, { useEffect } from 'react'

import { Memo, use$, useObservable } from '@legendapp/state/react'
import { Editor } from '@tiptap/core'
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  LinkIcon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react'
import { hideAll } from 'tippy.js'

import { cn } from '@/lib/utils'

import { openLinkEditor } from '../extensions/marks/LinkExtension'
import { useEditorContext } from '../hooks/EditorProvider'
import { ToolbarVerticalDivider } from './ToolbarVerticalDivider'

export const IsParagraph = ({ editor }: { editor: Editor }) => {
  const { isActive$ } = useEditorContext()

  const isParagraph = use$(isActive$.paragraph)

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

  if (!isParagraph) {
    return null
  }

  return (
    <>
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
      <ToolbarVerticalDivider />
      {[1, 2, 3, 4, 5].map((num) => (
        <Memo key={num}>
          {() => (
            <button
              className={cn(
                activeColor.get() === num
                  ? 'is-active rounded-md outline outline-2 -outline-offset-2 outline-eva-text-border'
                  : ''
              )}
              style={{ padding: '2px 12px' }}
              onClick={() =>
                editor.chain().focus().toggleTextDecoration(num).run()
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
