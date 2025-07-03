import { type Extensions } from '@tiptap/core'

import { IdMark } from './Id/Id'
import { LinkWithConfigure } from './LinkExtension'
import { basedMarkExtensions } from './basedMark'

export const markExtensions: Extensions = [
  ...basedMarkExtensions,
  LinkWithConfigure,
  IdMark,
]
