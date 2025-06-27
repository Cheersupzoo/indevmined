'use client'

import dynamic from 'next/dynamic'

export const CodeBlockWrapperStatic = dynamic(
  () => import('./CodeBlockWraper').then((m) => m.CodeBlockWrapper),
  { ssr: false }
)
