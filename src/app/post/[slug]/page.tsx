import { Metadata } from 'next'
import React from 'react'

import {
  generatePostMetadata,
  generatePostsStaticParams,
  getPostBySlug,
  parseMarkdownLink,
} from '@/utils/Mdx'

import Layout from '@/components/Layout'
import Post from '@/components/Post'

type Props = { params: Promise<{ slug: string }> }

export default async function page(props: Props) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug)

  const enUrl = post.frontmatter['language-en-link']
    ? parseMarkdownLink(post.frontmatter['language-en-link']!).url
    : undefined

  return (
    <Layout en={enUrl}>
      <Post post={post} />
    </Layout>
  )
}

export async function generateStaticParams() {
  return generatePostsStaticParams()
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  return generatePostMetadata(params.slug)
}
