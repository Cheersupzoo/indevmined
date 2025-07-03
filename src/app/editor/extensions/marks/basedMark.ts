import { type Extensions } from '@tiptap/core'
import Underline from '@tiptap/extension-underline'

import { AnimationMark } from './Animation'
import { IdMark } from './Id/Id'
import { CodeMark } from './MarkExtension'
import { Playful } from './Playful/Playful'
import { TextDecorationMark } from './TextDecorationMark'

export const basedMarkExtensions: Extensions = [
  Underline,
  CodeMark,
  Playful,
  TextDecorationMark,
  AnimationMark,
  IdMark,
]
