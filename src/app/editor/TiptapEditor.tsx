'use client'

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import '@/styles/markdown.css'
import './TiptapEditor.css'
import { Metadata } from 'next'
import {
  enableKeyboardNavigation,
  SlashCmdProvider
} from '@harshtalks/slash-tiptap'
import Placeholder from '@tiptap/extension-placeholder'
import TestComponent from './extensions/TestComponent/extension'
import { SlashCommand, SlashWithConfigure } from './extensions/SlashCommand'
import { BoldIcon, ItalicIcon, LinkIcon, StrikethroughIcon } from 'lucide-react'
import { LinkWithConfigure, useSetLink } from './extensions/LinkExtension'

export const metadata: Metadata = {
  title: 'Editor | In Dev Mined',
  description: 'In Dev Mined WYSIWYG Editor'
}

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      SlashWithConfigure,
      Placeholder.configure({
        placeholder: 'Press / to see available commands'
      }),
      // TODO: Remove TestComponent
      TestComponent,
      LinkWithConfigure
    ],
    immediatelyRender: false,
    editorProps: {
      handleDOMEvents: {
        keydown: (_, v) => enableKeyboardNavigation(v)
      }
    },
    content: `<h1>H1</h1><h2>H2</h2><h3>H3</h3><h4>H4</h4><p>Hello World! 🌎️</p><ul><li>list</li></ul><react-component count="1">
      <p>This is editable.</p>
      <p>This is editable.</p>
    </react-component>`
  })

  const setLink = useSetLink(editor)

  return (
    <SlashCmdProvider>
      <button onClick={() => console.log(editor?.getJSON())}>
        Export JSON
      </button>
      <EditorContent className='markdown-body' editor={editor} />
      <SlashCommand editor={editor} />
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
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
              onClick={setLink}
              className={editor.isActive('link') ? 'is-active' : ''}
            >
              <LinkIcon size={16} />
            </button>
          </div>
        </BubbleMenu>
      )}
    </SlashCmdProvider>
  )
}

export default TiptapEditor
