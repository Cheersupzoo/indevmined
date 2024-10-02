import Layout, { NormalResponsive } from '@/components/Layout'
import { getPostsMeta } from '@/utils/Mdx'
import { Clock } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import './style.css'
import { FaFacebookSquare } from 'react-icons/fa'

export default async function page() {
  const posts = await getPostsMeta()

  return (
    <Layout>
      <NormalResponsive>
        <div className='text-[2rem] leading-none text-text'>
          Posts From{' '}
          <a
            href={`https://www.facebook.com/profile.php?id=61558639690052`}
            title={`Facebook In Dev Mined`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-eva-text text-[1.5rem] hover:text-[#1877F2] inline-block'
          >
            <FaFacebookSquare />
          </a>
        </div>
        <div className='dot-grid parallax absolute -top-4 -left-6 h-32 w-32 -z-10'>
          {[...Array(100)].map((_, index) => (
            <div key={index} className='dot'></div>
          ))}
        </div>
        <div className='h-8' />
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/post/${post.slug}`}
            className='mb-4 block group'
          >
            <div className='text-color3 group-hover:text-color2 text-xl'>
              {post.title}
            </div>
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
