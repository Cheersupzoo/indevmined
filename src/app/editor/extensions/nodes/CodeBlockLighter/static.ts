'use client'

import dynamic from 'next/dynamic'

export const CodeBlockWrapperStatic = dynamic(() =>
  import('./CodeBlockStatic').then((m) => m.CodeBlockStatic)
)
