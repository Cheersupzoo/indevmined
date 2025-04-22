'use client'

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import '@/styles/markdown.css'
import './TiptapEditor.css'
import {
  enableKeyboardNavigation,
  SlashCmdProvider
} from '@harshtalks/slash-tiptap'
import Placeholder from '@tiptap/extension-placeholder'
import TestComponent from './extensions/TestComponent/extension'
import CodeBlock from './extensions/Code'
import { SlashCommand, SlashWithConfigure } from './extensions/SlashCommand'
import {
  BoldIcon,
  HighlighterIcon,
  ItalicIcon,
  LinkIcon,
  StrikethroughIcon,
  UnderlineIcon
} from 'lucide-react'
import { LinkWithConfigure, useSetLink } from './extensions/LinkExtension'
import { Underline } from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import { MoveNodeShortcut } from './extensions/MoveNodeShortcut'
import { CursorInfo } from './extensions/CursorInfo'
import { DragHandle } from './extensions/DragHandleExtension'
import { CodeBlockLighter } from './extensions/CodeBlockLighter'
import { findBlockNodeAt } from './extensions/DragHandleExtension/ProseMirrorPlugin'
import { CodeMark } from './extensions/CodeBlockLighter/MarkExtension'
import { cn } from '@/lib/utils'
import { PreNodeTools } from './PreNodeTools'
import { Box3dNode } from './extensions/React/Box3d'
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { useEffect, useRef, useState } from 'react'
import { TiptapCollabProvider } from '@hocuspocus/provider'
import { getAuth } from 'firebase/auth'
import { motion } from 'motion/react'

const TiptapEditor = ({ docId }: { docId: string }) => {
  const { current: ydoc } = useRef(new Y.Doc())
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [published, setPublished] = useState('2024-12-20')
  const [syncing, setSyncing] = useState(true)
  const meta = ydoc.getMap<string>('meta')

  useEffect(() => {
    const yTitle = meta.get('title')
    const yCategory = meta.get('category')
    const yPublished = meta.get('published')

    if (yTitle) {
      setTitle(yTitle)
    }
    if (yCategory) {
      setCategory(yCategory)
    }
    if (yPublished) {
      setPublished(yPublished)
    }

    const observer = (event: Y.YMapEvent<string>) => {
      if (event.keysChanged.has('title')) {
        setTitle(meta.get('title') as string)
      }
      if (event.keysChanged.has('category')) {
        setCategory(meta.get('category') as string)
      }
      if (event.keysChanged.has('published')) {
        setPublished(meta.get('published') as string)
      }
    }

    meta.observe(observer)

    return () => meta.unobserve(observer)
  }, [])

  useEffect(() => {
    const localProvider = new IndexeddbPersistence(docId, ydoc)

    return () => {
      localProvider.destroy()
    }
  }, [ydoc])

  useEffect(() => {
    let provider: TiptapCollabProvider
    const init = async () => {
      const auth = getAuth()
      const idToken = await auth.currentUser?.getIdToken()
      if (!idToken) {
        return
      }
      const res = await fetch(
        process.env.NEXT_PUBLIC_AUTH_ENDPOINT ?? '/editor/auth',
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      )

      if (res.status !== 200) {
        console.log('[Auth] Unauthorized to use editor')
        return
      }

      const { token } = await res.json()
      if (!process.env.NEXT_PUBLIC_TIP_TAP_APP_ID) {
        return new Error('Missing Tiptap app id')
      }
      provider = new TiptapCollabProvider({
        name: docId, // Unique document identifier for syncing. This is your document name.
        appId: process.env.NEXT_PUBLIC_TIP_TAP_APP_ID, // Your Cloud Dashboard AppID or `baseURL` for on-premises
        token,
        document: ydoc,
        onSynced: (event) => {
          if (syncing && event.state) {
            setSyncing(false)
          }
        }
      })
    }

    init()

    return () => {
      if (provider) {
        provider.destroy()
      }
    }
  }, [ydoc])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        history: false
      }),

      // Node
      Image,
      // TODO: Remove TestComponent
      TestComponent,
      CodeBlock,
      CodeBlockLighter,
      Box3dNode,

      // Mark
      Underline,
      CodeMark,

      // Functionality
      SlashWithConfigure,
      Placeholder.configure({
        placeholder: 'Press / to see available commands'
      }),
      LinkWithConfigure,
      MoveNodeShortcut,
      DragHandle,
      Collaboration.configure({
        document: ydoc,
        field: 'content'
      })
    ],
    immediatelyRender: false,
    editorProps: {
      handleDOMEvents: {
        keydown: (_, v) => enableKeyboardNavigation(v)
      }
    },
    content: `<h1>H1</h1><h2>H2</h2><h3>H3</h3><h4>H4</h4><p>Hello World! 🌎️</p><pre language="js"><code class="language-javascript">const str = '123';
str.replace('1','9')
const obj = {a: 'c'}</code></pre><ul><li>list</li></ul>
    <code-block lang="js">// !mark
const text="test";
    // !bg[5:8] gold
console.log('hello world')</code-block>
    <react-component count="1">
      <p>This is editable.</p>
      <p>This is editable.</p>
    </react-component>`
  })

  const setLink = useSetLink(editor)

  if (syncing) {
    return <></>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className='mt-12 relative'
    >
      <SlashCmdProvider>
        <input
          className='text-4xl font-bold mb-3 bg-transparent w-full outline-none'
          type='text'
          value={title}
          onChange={(e) => {
            const newTitle = e.target.value
            meta.set('title', newTitle)
          }}
          placeholder='Title'
        />
        <input
          className='text-xs text-text bg-color2 inline py-1 px-2 rounded-full outline-none min-w-0 w-fit'
          value={category}
          onChange={(e) => {
            meta.set('category', e.target.value)
          }}
        />

        <div className='text-sm font-thin text-text mt-1 mb-8'>
          <span className='select-none'>Published </span>
          <input
            value={published}
            className='bg-transparent outline-none'
            onChange={(e) => {
              meta.set('published', e.target.value)
            }}
          />
        </div>
        <div className='parallax select-none -z-10 absolute -top-7 -left-3 text-[10rem] leading-none text-foreground'>
          POST
        </div>
        <div className='relative'>
          <button
            className='absolute top-0 right-0 z-10'
            onClick={() => {
              console.log(editor?.getJSON())
              console.log(ydoc.toJSON())
            }}
          >
            Export JSON
          </button>
          <EditorContent className='markdown-body sm:-mx-16' editor={editor} />
          <PreNodeTools editor={editor} />
          <SlashCommand editor={editor} />
          {editor && (
            <BubbleMenu
              editor={editor}
              shouldShow={({ state, from, to }) => {
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
                  onClick={setLink}
                  className={editor.isActive('link') ? 'is-active' : ''}
                >
                  <LinkIcon size={16} />
                </button>
              </div>
            </BubbleMenu>
          )}
          {editor && (
            <BubbleMenu
              editor={editor}
              shouldShow={({ state, from, to }) => {
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
                  className={
                    editor.isActive('highlightMark') ? 'is-active' : ''
                  }
                >
                  <HighlighterIcon size={16} />
                </button>
                {['gold', 'green', 'blue', 'purple', 'red'].map((color) => {
                  return (
                    <button
                      key={color}
                      onClick={() =>
                        editor.chain().focus().setCodeHighlight(color).run()
                      }
                    >
                      <div
                        className={cn(
                          'h-4 w-4 bg-zinc-800 outline outline-1 outline-eva-text rounded-full',
                          editor.isActive('highlightMark', { color }) &&
                            'outline-blue-400'
                        )}
                      >
                        <div
                          className=' h-4 w-4 rounded-full'
                          style={{
                            backgroundColor: `rgb(from ${color} r g b / 0.13)`
                          }}
                        />
                      </div>
                    </button>
                  )
                })}
              </div>
            </BubbleMenu>
          )}
        </div>
        {/* {editor && <CursorInfo editor={editor} />} */}
      </SlashCmdProvider>
    </motion.div>
  )
}

export default TiptapEditor
