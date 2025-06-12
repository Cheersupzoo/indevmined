import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Offline'
}

export default function Page() {
  return (
    <>
      <h1>This is offline fallback page</h1>
    </>
  )
}
