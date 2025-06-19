import React from 'react'

import { FrontmatterContent } from '@/utils/Mdx/compileMdx'
import { CompileMDXResult } from 'next-mdx-remote/rsc'
import { z } from 'zod'

import '@/styles/markdown.css'

import { NormalResponsive } from '../Layout'
import './style.css'

type Props = {
  post: CompileMDXResult<FrontmatterContent>
}

const Schema = z.any()
const Post = ({ post }: Props) => {
  return (
    <NormalResponsive className='markdown-body text-eva-text/70'>
      <h1 className='mb-3 text-4xl font-bold'>
        {post.frontmatter.title as string}
      </h1>
      <div className='inline rounded-full bg-color2 px-2 py-1 text-xs text-text'>
        {post.frontmatter.categories}
      </div>
      <div className='mb-8 mt-1 text-sm font-thin text-text'>
        Published {post.frontmatter.published}
      </div>
      <div className='parallax absolute -left-3 -top-7 -z-10 select-none text-[10rem] leading-none text-foreground'>
        POST
      </div>
      {post.content}
    </NormalResponsive>
  )
}

export default Post
