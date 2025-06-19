import { deleteImage, handleImageUpload } from '@/apis/editor'
import { createSuggestionsItems } from '@harshtalks/slash-tiptap'
import { type Extensions } from '@tiptap/core'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import StarterKit from '@tiptap/starter-kit'
import {
  ChevronDownIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  ImageIcon,
  LayoutTemplateIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  MinusIcon,
  PencilRulerIcon,
  QuoteIcon,
  SquareCodeIcon,
  TypeIcon,
} from 'lucide-react'

import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node'

import CodeBlock from './Code'
import { CodeBlockLighter } from './CodeBlockLighter'
import { CustomImage } from './CustomImage'
import { DebugEditor } from './DebugEditor'
import ExcalidrawNode from './ExcalidrawNode'
import { ExcalidrawIcon } from './ExcalidrawNode/Icon'
import { GroupBlock } from './GroupBlock'
import { Box3dNode } from './React/Box3d'
import TestComponent from './TestComponent/extension'
import ToggleSection from './ToggleSection'

export const suggestionBlock = createSuggestionsItems([
  {
    title: 'Text',
    searchTerms: ['paragraph'],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode('paragraph', 'paragraph')
        .run()
    },
    icon: TypeIcon,
    mdShortcut: '',
  },
  {
    title: 'Heading 1',
    searchTerms: ['heading'],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 1 })
        .run()
    },
    icon: Heading1Icon,
    mdShortcut: '#',
  },
  {
    title: 'Heading 2',
    searchTerms: ['heading'],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 2 })
        .run()
    },
    icon: Heading2Icon,
    mdShortcut: '##',
  },
  {
    title: 'Heading 3',
    searchTerms: ['heading'],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 3 })
        .run()
    },
    icon: Heading3Icon,
    mdShortcut: '###',
  },
  {
    title: 'Heading 4',
    searchTerms: ['heading'],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 4 })
        .run()
    },
    icon: Heading4Icon,
    mdShortcut: '####',
  },
  {
    title: 'Bullet List',
    searchTerms: ['unordered', 'point'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
    icon: ListIcon,
    mdShortcut: '-',
  },
  {
    title: 'Ordered List',
    searchTerms: ['ordered', 'point', 'numbers'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
    icon: ListOrderedIcon,
    mdShortcut: '1.',
  },
  {
    title: 'Task List',
    searchTerms: ['task', 'checkbox'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
    },
    icon: ListTodoIcon,
    mdShortcut: '[ ]',
  },
  {
    title: 'Divider',
    searchTerms: ['divider', 'line'],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        // .setHorizontalRule()
        .setHorizontalRule()

        .insertContentAt(range.from, editor.schema.nodes.paragraph.create())
        .run()
    },
    icon: MinusIcon,
    mdShortcut: '---',
  },
  {
    title: 'Quote',
    searchTerms: ['divider', 'line'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    },
    icon: QuoteIcon,
    mdShortcut: '>',
  },
  {
    title: 'Toggle',
    searchTerms: ['toggle', 'section', 'foldable'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleSection().run()
    },
    icon: ChevronDownIcon,
  },
  {
    title: 'Image',
    searchTerms: ['img', 'photo'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setImageUploadNode().run()
    },
    icon: ImageIcon,
  },
  {
    title: 'Code Block',
    searchTerms: ['coding', 'programming'],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleCodeBlock({ language: 'javascript' })
        .run()
    },
    icon: SquareCodeIcon,
    mdShortcut: '```',
  },
  {
    title: 'React Component',
    searchTerms: ['react'],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'reactComponent',
          attrs: { count: 9 },
          content: [{ type: 'paragraph' }],
        })
        .run()
    },
    icon: LayoutTemplateIcon,
  },
  {
    title: 'React Component - 3D Box',
    searchTerms: ['react'],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: Box3dNode.name,
        })
        .run()
    },
    icon: LayoutTemplateIcon,
  },
  {
    title: 'Excalidraw',
    searchTerms: ['react'],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: ExcalidrawNode.name,
        })
        .run()
    },
    icon: ExcalidrawIcon,
  },
  {
    title: 'Debug Editor',
    searchTerms: ['debug'],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: DebugEditor.name,
        })
        .run()
    },
    icon: PencilRulerIcon,
  },
])

export const nodeExtensions: Extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3, 4] },
    history: false,
  }),

  // Node
  CustomImage.configure({
    deleteImage(url) {
      if (url.startsWith('https://cdn.indevmined.com')) {
        const key = url.replace('https://cdn.indevmined.com/', '')
        deleteImage(key)
      }
    },
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
    onError: (error) => console.error('Upload failed:', error),
  }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  GroupBlock,
  ToggleSection,
  DebugEditor,
]
