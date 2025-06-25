import { type Extensions } from '@tiptap/core'
import Underline from '@tiptap/extension-underline'

import { CodeMark } from './MarkExtension'
import { Playful } from './Playful/Playful'
import { TextDecorationMark } from './TextDecorationMark'
import { LinkWithConfigure } from './LinkExtension'

export const markExtensions: Extensions = [
  Underline,
  CodeMark,
  Playful,
  TextDecorationMark,
  LinkWithConfigure,
]
