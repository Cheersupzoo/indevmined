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
    categories,
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

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  return generatePostMetadata(params.slug, 'en')
}
