import {
  createSuggestionsItems,
} from '@harshtalks/slash-tiptap'
import {
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  ImageIcon,
  LayoutTemplateIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  QuoteIcon,
  SquareCodeIcon,
  TypeIcon
} from 'lucide-react'
import { Box3dNode } from './React/Box3d'

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
    mdShortcut: ''
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
    mdShortcut: '#'
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
    mdShortcut: '##'
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
    mdShortcut: '###'
  },
  {
    title: 'Heading 4',
    searchTerms: ['heading'],
    command: ({ editor, range }) => {
      const l =editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleHeading({ level: 4 })
        .run()
        console.log(l);
        
    },
    icon: Heading4Icon,
    mdShortcut: '####'
  },
  {
    title: 'Bullet List',
    searchTerms: ['unordered', 'point'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
    icon: ListIcon,
    mdShortcut: '-'
  },
  {
    title: 'Ordered List',
    searchTerms: ['ordered', 'point', 'numbers'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
    icon: ListOrderedIcon,
    mdShortcut: '1.'
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
    mdShortcut: '---'
  },
  {
    title: 'Quote',
    searchTerms: ['divider', 'line'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    },
    icon: QuoteIcon,
    mdShortcut: '>'
  },
  {
    title: 'Image',
    searchTerms: ['img', 'photo'],
    command: ({ editor, range }) => {
      const url = window.prompt('URL')

      if (url) {
        editor.chain().focus().deleteRange(range).setImage({ src: url }).run()
      }
    },
    icon: ImageIcon
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
    mdShortcut: '```'
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
          content: [{ type: 'paragraph' }]
        })
        .run()
    },
    icon: LayoutTemplateIcon
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
          type: Box3dNode.name
        })
        .run()
    },
    icon: LayoutTemplateIcon
  }
])