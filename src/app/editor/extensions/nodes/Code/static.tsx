'use client'

import dynamic from 'next/dynamic'

export const CodeStatic = dynamic(
  () => import('./Component').then((mod) => mod.CodeBlock),
  { ssr: false }
)
