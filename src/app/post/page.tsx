import { Metadata } from 'next'
import React from 'react'

import { getPostsMeta } from '@/utils/Mdx'

import Layout from '@/components/Layout'
import PostExplorer from '@/components/PostExplorer'

export default async function page() {
  const posts = await getPostsMeta()

  return (
    <Layout en='/en/post'>
      <PostExplorer posts={posts} />
    </Layout>
  )
}

export const metadata: Metadata = {
  title: 'Posts | In Dev Mined',
  description: 'All In Dev Mined Posts',
}
