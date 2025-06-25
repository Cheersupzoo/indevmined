import { type Extensions } from '@tiptap/core'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'

import { DragHandle } from './DragHandleExtension'
import { DropImageExtension } from './DropImage'
import { MoveNodeShortcut } from './MoveNodeShortcut'
import { SlashWithConfigure } from './SlashCommand'

export const functionalityExtensions: Extensions = [
  SlashWithConfigure,
  Placeholder.configure({
    includeChildren: true,
    placeholder: ({ node }) => {
      if (node.type.name === 'heading') {
        return `Header ${node.attrs.level}`
      }

      return 'Press / to see available commands'
    },
  }),
  MoveNodeShortcut,
  DragHandle,
  Typography,
  DropImageExtension,
]
