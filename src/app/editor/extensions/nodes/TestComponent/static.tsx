'use client'

import dynamic from 'next/dynamic'

export const ReactComponent = dynamic(() =>
  import('./component').then((mod) => mod.default)
)
