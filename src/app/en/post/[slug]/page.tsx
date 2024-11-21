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
  const post = await getPostBySlug(decodeURI(params.slug), 'en')
  const { url: thUrl, slug: thSlug } = parseMarkdownLink(
    post.frontmatter['language-th-link']!,
    'th'
  )
  const thPost = await getPostBySlug(thSlug)
  const { published, categories } = thPost.frontmatter
  post.frontmatter = {
    ...post.frontmatter,
    published,
    categories
  }

  return (
    <Layout th={thUrl} isEN>
      <Post post={post} />
    </Layout>
  )
}

export async function generateStaticParams() {
  return generatePostsStaticParams('en')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generatePostMetadata(params.slug, 'en')
}
