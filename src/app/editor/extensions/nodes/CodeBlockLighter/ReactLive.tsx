'use client'

import dynamic from 'next/dynamic'

const LiveProvider = dynamic(
  () => import('react-live').then((m) => m.LiveProvider),
  { ssr: false }
)
const LivePreview = dynamic(
  () => import('react-live').then((m) => m.LivePreview),
  { ssr: false }
)
const LiveError = dynamic(() => import('react-live').then((m) => m.LiveError), {
  ssr: false,
})

export const ReactLive = ({
  code,
  previewCenter,
}: {
  code: string
  previewCenter?: boolean
}) => {
  return (
    <LiveProvider code={code} noInline>
      <LiveError className='mt-2 bg-red-100 text-red-800' />
      {!previewCenter ? (
        <LivePreview />
      ) : (
        <div className='flex h-full items-center justify-center'>
          {' '}
          <LivePreview />
        </div>
      )}
    </LiveProvider>
  )
}
