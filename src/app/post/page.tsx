import Layout from '@/components/Layout'
import { getPostSlugs } from '@/utils/Mdx'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export default function page() {
  const files = getPostSlugs()

  return (
    <Layout>
      <div className='text-text relative mx-auto max-w-2xl w-full text-lg'>
        {files.map((file) => (
          <div key={file}>
            <Link href={`/post/${file.replace('.md', '')}`}>{file}</Link>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export const metadata: Metadata = {
  title: 'Posts | In Dev Mined',
  description: 'All In Dev Mined Posts'
}
