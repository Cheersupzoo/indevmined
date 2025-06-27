import { Extensions } from '@tiptap/core'
import Link from '@tiptap/extension-link'

import { basedMarkExtensions } from './basedMark'

export const staticMarkExtensions: Extensions = [...basedMarkExtensions, Link]
