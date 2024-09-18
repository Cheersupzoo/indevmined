import { FrontmatterContent } from '@/utils/Mdx'
import { CompileMDXResult } from 'next-mdx-remote/rsc'
import React from 'react'
import './style.css'

type Props = {
  post: CompileMDXResult<FrontmatterContent>
}
const Post = ({ post }: Props) => {
  return (
    <div className='relative mx-auto max-w-2xl text-lg text-eva-text'>
      <h1 className='text-4xl font-bold mb-3'>
        {post.frontmatter.title as string}
      </h1>
      <h3 className='text-xs text-text bg-color2 inline py-1 px-2 rounded-full '>
        {post.frontmatter.categories}
      </h3>
      <h5 className='text-sm font-thin text-text mt-1 mb-8'>
        Published {post.frontmatter.published}
      </h5>
      <div className='parallax select-none -z-10 absolute -top-7 -left-3 text-[10rem] leading-none text-foreground'>
        POST
      </div>
      {post.content}
    </div>
  )
}

export default Post
