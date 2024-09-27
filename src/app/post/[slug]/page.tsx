import {
  generatePostMetadata,
  generatePostsStaticParams,
  getPostBySlug,
  parseMarkdownLink
} from '@/utils/Mdx'
import React from 'react'
import Layout from '@/components/Layout'
import { Metadata } from 'next'
import Post from '@/components/Post'

type Props = { params: { slug: string } }

export default async function page({ params }: Props) {
  const post = await getPostBySlug(decodeURI(params.slug))
  const enUrl = parseMarkdownLink(post.frontmatter['language-en-link']!).url

  return (
    <Layout en={enUrl}>
      <Post post={post} />
    </Layout>
  )
}

export async function generateStaticParams() {
  return generatePostsStaticParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generatePostMetadata(params.slug)
}
