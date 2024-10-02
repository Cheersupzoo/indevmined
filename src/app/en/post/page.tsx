import Layout from '@/components/Layout'
import { getPostsMeta } from '@/utils/Mdx'
import { Metadata } from 'next'
import React from 'react'

import PostExplorer from '@/components/PostExplorer'

export default async function page() {
  const posts = await getPostsMeta()

  return (
    <Layout th='/post'>
      <PostExplorer posts={posts} en />
    </Layout>
  )
}

export const metadata: Metadata = {
  title: 'Posts | In Dev Mined',
  description: 'All In Dev Mined Posts'
}
