'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import '@/styles/markdown.css'
import './TiptapEditor.css'
import {
  enableKeyboardNavigation,
  SlashCmdProvider
} from '@harshtalks/slash-tiptap'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TestComponent from './extensions/TestComponent/extension'
import CodeBlock from './extensions/Code'
import { SlashCommand, SlashWithConfigure } from './extensions/SlashCommand'
import { LinkWithConfigure } from './extensions/LinkExtension'
import { TextFormatMenu } from './components/TextFormatMenu'
import { CodeFormatMenu } from './components/CodeFormatMenu'
import { Underline } from '@tiptap/extension-underline'
import { MoveNodeShortcut } from './extensions/MoveNodeShortcut'
import { CursorInfo } from './extensions/CursorInfo'
import { DragHandle } from './extensions/DragHandleExtension'
import { CodeBlockLighter } from './extensions/CodeBlockLighter'
import { CodeMark } from './extensions/CodeBlockLighter/MarkExtension'
import { PreNodeTools } from './PreNodeTools'
import { Box3dNode } from './extensions/React/Box3d'
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { useEffect } from 'react'
import { motion } from 'motion/react'
import { use$, useObservable } from '@legendapp/state/react'
import { $React } from '@legendapp/state/react-web'
import { useEditorContext } from './hooks/EditorProvider'
import { Spinner } from '@/components/Spinner'
import { useIsMobile } from '@/hooks/use-mobile'
import dynamic from 'next/dynamic'
import ExcalidrawNode from './extensions/ExcalidrawNode'
import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node'
import { deleteImage, handleImageUpload } from '@/apis/editor'
import { CustomImage } from './extensions/CustomImage'
import { ObservableHint } from '@legendapp/state'
import { DropImageExtension } from './extensions/DropImage'
import { ToggleSection } from './extensions/ToggleSection'
import { GroupBlock } from './extensions/GroupBlock'
const EditorToolbarMobile = dynamic(() =>
  import('./EditorToolbarMobile').then((mod) => mod.EditorToolbarMobile)
)

const TiptapEditor = ({ docId }: { docId: string }) => {
  const { ydoc$, currentEditor, syncing$ } = useEditorContext()
  const title$ = useObservable('')
  const category$ = useObservable('')
  const published$ = useObservable('2024-12-20')
  const ydoc = use$(ydoc$)
  const meta = ydoc.getMap<string>('meta')

  const isMobile = useIsMobile()

  useEffect(() => {
    const yTitle = meta.get('title')
    const yCategory = meta.get('category')
    const yPublished = meta.get('published')

    if (yTitle) {
      title$.set(yTitle)
    }
    if (yCategory) {
      category$.set(yCategory)
    }
    if (yPublished) {
      published$.set(yPublished)
    }

    const observer = (event: Y.YMapEvent<string>) => {
      if (event.keysChanged.has('title')) {
        title$.set(meta.get('title') as string)
      }
      if (event.keysChanged.has('category')) {
        category$.set(meta.get('category') as string)
      }
      if (event.keysChanged.has('published')) {
        published$.set(meta.get('published') as string)
      }
    }

    meta.observe(observer)

    return () => meta.unobserve(observer)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        history: false
      }),

      // Node
      CustomImage.configure({
        deleteImage(url) {
          if (url.startsWith('https://cdn.indevmined.com')) {
            const key = url.replace('https://cdn.indevmined.com/', '')
            deleteImage(key)
          }
        }
      }),
      // TODO: Remove TestComponent
      TestComponent,
      CodeBlock,
      CodeBlockLighter,
      Box3dNode,
      ExcalidrawNode,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: 5 * 1024 * 1024,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error('Upload failed:', error)
      }),
      TaskList,
      TaskItem.configure({
        nested: true
      }),
      GroupBlock,
      ToggleSection,

      // Mark
      Underline,
      CodeMark,

      // Functionality
      SlashWithConfigure,
      Placeholder.configure({
        includeChildren: true,
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return `Header ${node.attrs.level}`
          }

          return 'Press / to see available commands'
        }
      }),
      LinkWithConfigure,
      MoveNodeShortcut,
      DragHandle,
      Collaboration.configure({
        document: ydoc,
        field: 'content'
      }),
      Typography,
      DropImageExtension
    ],
    immediatelyRender: false,
    editorProps: {
      handleDOMEvents: {
        keydown: (_, v) => enableKeyboardNavigation(v)
      }
    },
    onCreate: (event) => {
      currentEditor.set(ObservableHint.opaque(event.editor))
    }
    //     content: `<h1>H1</h1><h2>H2</h2><h3>H3</h3><h4>H4</h4><p>Hello World! 🌎️</p><pre language="js"><code class="language-javascript">const str = '123';
    // str.replace('1','9')
    // const obj = {a: 'c'}</code></pre><ul><li>list</li></ul>
    //     <code-block lang="js">// !mark
    // const text="test";
    //     // !bg[5:8] gold
    // console.log('hello world')</code-block>
    //     <react-component count="1">
    //       <p>This is editable.</p>
    //       <p>This is editable.</p>
    //     </react-component>`
  })

  const syncing = use$(syncing$)

  if (syncing) {
    return (
      <motion.div
        key='Tiptap-editor-spinner'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className='absolute top-16'
      >
        <Spinner />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className='mt-12 relative'
    >
      <SlashCmdProvider>
        <$React.input
          className='text-4xl font-bold mb-3 bg-transparent w-full outline-none'
          type='text'
          $value={title$}
          onChange={(e) => {
            const newTitle = e.target.value
            meta.set('title', newTitle)
          }}
          placeholder='Title'
        />
        <$React.input
          className='text-xs text-text bg-color2 inline py-1 px-2 rounded-full outline-none min-w-0 w-fit'
          $value={category$}
          onChange={(e) => {
            meta.set('category', e.target.value)
          }}
        />

        <div className='text-sm font-thin text-text mt-1 mb-8'>
          <span className='select-none'>Published </span>
          <$React.input
            $value={published$}
            className='bg-transparent outline-none'
            onChange={(e) => {
              meta.set('published', e.target.value)
            }}
          />
        </div>
        <div className='parallax select-none -z-10 absolute -top-7 -left-3 text-[9rem] md:text-[10rem] leading-none text-foreground'>
          POST
        </div>
        <div className='relative'>
          <EditorContent
            className='markdown-body sm:-mx-16 pb-24'
            editor={editor}
          />
          <PreNodeTools editor={editor} />
          <SlashCommand editor={editor} />
          {!isMobile && editor && <TextFormatMenu editor={editor} />}
          {!isMobile && editor && <CodeFormatMenu editor={editor} />}
        </div>
        {/* {editor && <CursorInfo editor={editor} />} */}
        {isMobile && editor && <EditorToolbarMobile editor={editor} />}
      </SlashCmdProvider>
    </motion.div>
  )
}

export default TiptapEditor
