'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'

import * as Y from 'yjs'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  SlashCmdProvider,
  enableKeyboardNavigation,
} from '@harshtalks/slash-tiptap'
import { ObservableHint } from '@legendapp/state'
import { use$, useObservable } from '@legendapp/state/react'
import { $React } from '@legendapp/state/react-web'
import Collaboration from '@tiptap/extension-collaboration'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import { motion } from 'motion/react'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'

import { Spinner } from '@/components/Spinner'
import '@/styles/markdown.css'

import { PreNodeTools } from './PreNodeTools'
import './TiptapEditor.css'
import { CodeFormatMenu } from './components/CodeFormatMenu'
import { TextFormatMenu } from './components/TextFormatMenu'
import { CursorInfo } from './extensions/CursorInfo'
import { SlashCommand } from './extensions/functionality/SlashCommand'
import { functionalityExtensions } from './extensions/functionality/functionality'
import { markExtensions } from './extensions/marks/marks'
import { nodeExtensions } from './extensions/nodes/nodes'
import { useEditorContext } from './hooks/EditorProvider'

const EditorToolbarMobile = dynamic(
  () => import('./EditorToolbarMobile').then((mod) => mod.EditorToolbarMobile),
  { ssr: false }
)

const TiptapEditor = ({ docId }: { docId: string }) => {
  const { ydoc$, currentEditor, syncing$, isActive$, error$ } =
    useEditorContext()
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

  const updateActive = ({ editor }: { editor: Editor }) => {
    isActive$.set({
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      strike: editor.isActive('strike'),
      underline: editor.isActive('underline'),
      link: editor.isActive('link'),
      highlightMark: editor.isActive('highlightMark'),
      codeBlock: editor.isActive('codeBlock'),
      paragraph: editor.isActive('paragraph'),
      code: editor.isActive('code'),
      playful: editor.isActive('playful'),
      animation: editor.isActive('animation'),
    })
  }

  const editor = useEditor({
    shouldRerenderOnTransaction: false,
    onSelectionUpdate: updateActive,
    onUpdate: updateActive,
    extensions: [
      ...nodeExtensions,
      ...markExtensions,
      ...functionalityExtensions,

      // Collaboration
      Collaboration.configure({
        document: ydoc,
        field: 'content',
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      handleDOMEvents: {
        keydown: (_, v) => enableKeyboardNavigation(v),
        selectstart: (_, e) => {
          if (
            e.target &&
            typeof (e.target as HTMLDivElement).closest === 'function' &&
            (e.target as HTMLDivElement).closest('.ProseMirror-selectednode')
          ) {
            e.preventDefault()
            e.stopPropagation()

            return true
          }

          return false
        },
      },
    },
    onCreate: (event) => {
      currentEditor.set(ObservableHint.opaque(event.editor))
    },
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
    enableContentCheck: true,
    onContentError: ({ editor, error, disableCollaboration }) => {
      console.error('onContentError', error)
      error$.set('mismatch_version')
      disableCollaboration()

      editor.setEditable(false, false)
    },
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
      className='relative mt-12'
    >
      <SlashCmdProvider>
        <$React.input
          className='mb-3 w-full bg-transparent text-4xl font-bold outline-none'
          type='text'
          $value={title$}
          onChange={(e) => {
            const newTitle = e.target.value
            meta.set('title', newTitle)
          }}
          placeholder='Title'
        />
        <$React.input
          className='inline w-fit min-w-0 rounded-full bg-color2 px-2 py-1 text-xs text-text outline-none'
          $value={category$}
          onChange={(e) => {
            meta.set('category', e.target.value)
          }}
        />

        <div className='mb-8 mt-1 text-sm font-thin text-text'>
          <span className='select-none'>Published </span>
          <$React.input
            $value={published$}
            className='bg-transparent outline-none'
            onChange={(e) => {
              meta.set('published', e.target.value)
            }}
          />
        </div>
        <div className='parallax absolute -left-3 -top-7 -z-10 select-none text-[9rem] leading-none text-foreground md:text-[10rem]'>
          POST
        </div>
        <div className='relative'>
          <EditorContent className='markdown-body sm:-mx-16' editor={editor} />
          <PreNodeTools editor={editor} />
          <SlashCommand editor={editor} />
          <ErrorBoundary fallback={<ErrorFallback />}>
            {!isMobile && editor && <TextFormatMenu editor={editor} />}
          </ErrorBoundary>
          <ErrorBoundary fallback={<ErrorFallback />}>
            {!isMobile && editor && <CodeFormatMenu editor={editor} />}
          </ErrorBoundary>
        </div>
        {/* {editor && <CursorInfo editor={editor} />} */}
        {isMobile && editor && <EditorToolbarMobile editor={editor} />}
      </SlashCmdProvider>
    </motion.div>
  )
}

export default TiptapEditor

// TODO: Reimprement BubbleMenu so this ErrorBoundary is not needed
const ErrorFallback = () => {
  const { resetBoundary } = useErrorBoundary()

  useEffect(() => {
    resetBoundary()
  }, [])

  return <></>
}
