import { PostMeta } from '@/utils/Mdx/compileMdx';
import { Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const PostList = ({ posts, en }: { posts: PostMeta[]; en?: boolean }) => {
  return (
    <>
      {posts
        .filter((post) => (en ? post.en : true))
        .map((post) => (
          <Link
            key={post.slug}
            href={(en ? post.en?.url : `/post/${post.slug}`) ?? ''}
            className='mb-4 block group'
          >
            <div className='text-color3 group-hover:text-color2 text-xl'>
              {en ? post.en?.title : post.title}
            </div>
            <div className='flex items-center text-xs space-x-4'>
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
