import Layout from '@/components/Layout'
import Question from '@/components/Question'
import { getPostsMeta } from '@/utils/Mdx'
import { Clock } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

export default async function page() {
  const posts = await getPostsMeta()

  return (
    <Layout>
      <div className='text-text relative mx-auto max-w-2xl w-full text-lg'>
        <Question />
        <div className='text-sm text-center text-zinc-500 mt-2 mb-8'>
          AI can make mistakes. Check important info.
        </div>
        <div className='text-[2rem] leading-none text=text font-medium mb-6'>
          Read Post directly
        </div>
        {posts.map((post) => (
          <Link key={post.slug} href={`/post/${post.slug}`} className='mb-4 block group'>
            <div className='text-color3 group-hover:text-color2 text-xl'>{post.title}</div>
            <div className='flex items-center text-xs'>
              <Clock size={14} className='mr-1' /> {post['reading-time']} minute
              read
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  )
}

export const metadata: Metadata = {
  title: 'Posts | In Dev Mined',
  description: 'All In Dev Mined Posts'
}
