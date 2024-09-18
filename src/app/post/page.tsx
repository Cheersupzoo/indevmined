import { getPostSlugs } from '@/utils/Mdx'
import Link from 'next/link'
import React from 'react'

export default function page() {
  const files = getPostSlugs()

  return (
    <div>
      {files.map((file) => (
        <div key={file}>
          <Link href={`/post/${file.replace('.md', '')}`}>{file}</Link>
        </div>
      ))}
    </div>
  )
}
