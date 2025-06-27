import { type Extensions } from '@tiptap/core'
import Underline from '@tiptap/extension-underline'

import { CodeMark } from './MarkExtension'
import { Playful } from './Playful/Playful'
import { TextDecorationMark } from './TextDecorationMark'

export const basedMarkExtensions: Extensions = [
  Underline,
  CodeMark,
  Playful,
  TextDecorationMark,
]
