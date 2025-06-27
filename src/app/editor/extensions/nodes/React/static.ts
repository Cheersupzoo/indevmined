'use client'

import dynamic from 'next/dynamic'

export const Box3dStatic = dynamic(
  () => import('./Renderer').then((mod) => mod.Box3d),
  { ssr: false }
)
