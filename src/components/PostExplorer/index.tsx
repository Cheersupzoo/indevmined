import { PostMeta } from '@/utils/Mdx'
import React from 'react'
import PostList from './PostList'
import { NormalResponsive } from '../Layout'
import { FaFacebookSquare } from 'react-icons/fa'
import './style.css'

const PostExplorer = ({ posts, en }: { posts: PostMeta[]; en?: boolean }) => {
  return (
    <>
      <NormalResponsive>
        <div className='text-[2rem] leading-none text-text mb-4 mt-6'>Post</div>
        <div>
          {en ? (
            <>
              Posts translated from our{' '}
              <a
                href={`https://www.facebook.com/profile.php?id=61558639690052`}
                title={`Facebook In Dev Mined`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-eva-text text-[1.2rem] hover:text-[#1877F2] inline-block'
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
                className='text-eva-text text-[1.2rem] hover:text-[#1877F2] inline-block'
              >
                <FaFacebookSquare />
              </a>{' '}
              กับเพิ่มเติมของแถม
            </>
          )}
        </div>
        <div className='post-dot-grid absolute -top-4 -right-6 h-32 w-32 -z-10'>
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
