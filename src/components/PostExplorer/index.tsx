import React from 'react'

import { PostMeta } from '@/utils/Mdx/compileMdx'
import { FaFacebookSquare } from 'react-icons/fa'

import { NormalResponsive } from '../Layout'
import PostList from './PostList'
import './style.css'

const PostExplorer = ({ posts, en }: { posts: PostMeta[]; en?: boolean }) => {
  return (
    <>
      <NormalResponsive>
        <div className='mb-4 mt-6 text-[2rem] leading-none text-text'>Post</div>
        <div>
          {en ? (
            <>
              Posts translated from our{' '}
              <a
                href={`https://www.facebook.com/profile.php?id=61558639690052`}
                title={`Facebook In Dev Mined`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-block text-[1.2rem] text-eva-text hover:text-[#1877F2]'
              >
                <FaFacebookSquare />
              </a>{' '}
              plus some more
            </>
          ) : (
            <>
              โพสต์เนื้อหาเดียวกันจาก{' '}
              <a
                href={`https://www.facebook.com/profile.php?id=61558639690052`}
                title={`Facebook In Dev Mined`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-block text-[1.2rem] text-eva-text hover:text-[#1877F2]'
              >
                <FaFacebookSquare />
              </a>{' '}
              กับเพิ่มเติมของแถม
            </>
          )}
        </div>
        <div className='post-dot-grid absolute -right-6 -top-4 -z-10 h-32 w-32'>
          {[...Array(100)].map((_, index) => (
            <div key={index} className='dot'></div>
          ))}
        </div>
        <div className='h-8' />
        <PostList posts={posts} en={en} />
      </NormalResponsive>
    </>
  )
}

export default PostExplorer
