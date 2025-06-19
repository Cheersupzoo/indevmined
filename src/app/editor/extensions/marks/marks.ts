import { type Extensions } from '@tiptap/core'
import Underline from '@tiptap/extension-underline'

import { CodeMark } from '../nodes/CodeBlockLighter/MarkExtension'
import { Playful } from './Playful/Playful'

export const markExtensions: Extensions = [Underline, CodeMark, Playful]
