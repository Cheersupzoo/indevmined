import Link from 'next/link'
import React from 'react'

import { PostMeta } from '@/utils/Mdx/compileMdx'
import { Calendar, Clock } from 'lucide-react'

const PostList = ({ posts, en }: { posts: PostMeta[]; en?: boolean }) => {
  return (
    <>
      {posts
        .filter((post) => (en ? post.en : true))
        .map((post) => (
          <Link
            key={post.slug}
            href={(en ? post.en?.url : `/post/${post.slug}`) ?? ''}
            className='group mb-4 block'
          >
            <div className='text-xl text-color3 group-hover:text-color2'>
              {en ? post.en?.title : post.title}
            </div>
            {(en ? post.en?.description : post.description) && (
              <div className='mb-2 mt-2 text-base'>
                {en ? post.en?.description : post.description}
              </div>
            )}
            <div className='flex items-center space-x-4 text-xs'>
              <div className='flex items-center'>
                <Calendar size={14} className='mr-1' /> {post.published}
              </div>
              <div className='flex items-center'>
                <Clock size={14} className='mr-1' /> {post['reading-time']}{' '}
                minute read
              </div>
            </div>
          </Link>
        ))}
    </>
  )
}

export default PostList
