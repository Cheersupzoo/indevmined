import {
  generatePostMetadata,
  generatePostsStaticParams,
  getPostBySlug
} from '@/utils/Mdx'
import React from 'react'
import Layout from '@/components/Layout'
import { Metadata } from 'next'
import Post from '@/components/Post'

type Props = { params: { slug: string } }

export default async function page({ params }: Props) {
  const post = await getPostBySlug(decodeURI(params.slug))
  const enSlug = post.frontmatter['language-en-link']
    ?.slice(2)
    .slice(0, -2)
    .split('|')[0]
    .slice(3)
  const enUrl = `/en/post/${enSlug}`

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
