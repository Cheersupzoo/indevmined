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

export const IsParagraph = ({ editor }: { editor: Editor }) => {
  if (!editor.isActive('paragraph')) {
    return <></>
  }

  return (
    <>
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
