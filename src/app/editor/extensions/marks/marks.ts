import { type Extensions } from '@tiptap/core'

import { LinkWithConfigure } from './LinkExtension'
import { basedMarkExtensions } from './basedMark'


export const markExtensions: Extensions = [
  ...basedMarkExtensions,
  LinkWithConfigure,
]


