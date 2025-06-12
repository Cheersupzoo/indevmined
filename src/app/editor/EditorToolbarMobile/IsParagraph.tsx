import { Editor } from '@tiptap/core'
import {
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  RemoveFormattingIcon,
  StrikethroughIcon,
  UnderlineIcon
} from 'lucide-react'
import React from 'react'
import { hideAll } from 'tippy.js'
import { openLinkEditor } from '../extensions/LinkExtension'
import { ToolbarVerticalDivider } from './ToolbarVerticalDivider'
import { useEditorContext } from '../hooks/EditorProvider'
import { Memo, use$ } from '@legendapp/state/react'

export const IsParagraph = ({ editor }: { editor: Editor }) => {
  const { isActive$ } = useEditorContext()

  const isParagraph = use$(isActive$.paragraph)

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
      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        title='Clear formatting'
      >
        <RemoveFormattingIcon size={16} />
      </button>
    </>
  )
}
