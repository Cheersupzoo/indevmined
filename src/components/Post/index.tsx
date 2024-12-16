import { CompileMDXResult } from 'next-mdx-remote/rsc'
import React from 'react'
import './style.css'
import { NormalResponsive } from '../Layout'
import { FrontmatterContent } from '@/utils/Mdx/compileMdx'
import { z } from 'zod'
import { Block, parseProps, parseRoot } from 'codehike/blocks'
import { parse } from 'codehike'

type Props = {
  post: CompileMDXResult<FrontmatterContent>
}

const Schema = z.any()
const Post = ({ post }: Props) => {
  return (
    <NormalResponsive className='text-eva-text/70 markdown-body'>
      <h1 className='text-4xl font-bold mb-3'>
        {post.frontmatter.title as string}
      </h1>
      <div className='text-xs text-text bg-color2 inline py-1 px-2 rounded-full '>
        {post.frontmatter.categories}
      </div>
      <div className='text-sm font-thin text-text mt-1 mb-8'>
        Published {post.frontmatter.published}
      </div>
      <div className='parallax select-none -z-10 absolute -top-7 -left-3 text-[10rem] leading-none text-foreground'>
        POST
      </div>
      {post.content}
    </NormalResponsive>
  )
}

export default Post
