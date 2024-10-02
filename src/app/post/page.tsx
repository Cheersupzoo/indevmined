import Layout, { NormalResponsive } from '@/components/Layout'
import { getPostsMeta } from '@/utils/Mdx'
import { Clock } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export default async function page() {
  const posts = await getPostsMeta()

  return (
    <Layout>
      <NormalResponsive>
        {posts.map((post) => (
          <Link key={post.slug} href={`/post/${post.slug}`} className='mb-4 block group'>
            <div className='text-color3 group-hover:text-color2 text-xl'>{post.title}</div>
            <div className='flex items-center text-xs'>
              <Clock size={14} className='mr-1' /> {post['reading-time']} minute
              read
            </div>
          </Link>
        ))}
      </NormalResponsive>
    </Layout>
  )
}

export const metadata: Metadata = {
  title: 'Posts | In Dev Mined',
  description: 'All In Dev Mined Posts'
}
