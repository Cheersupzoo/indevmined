import { join } from 'path'
import fs from 'fs'
import { compileMDX, type CompileMDXResult } from 'next-mdx-remote/rsc'
import imageUrlTransformer from './rehype/imageUrlTransformer'
import wikiLinkPlugin from 'remark-wiki-link'
import imageSizeEmbedder from './rehype/imageSizeEmbedder'
import type { Metadata } from 'next'

const postsDirectory = join(process.cwd(), 'vault')

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory).filter((path) => path.endsWith('.md'))
}
export function getPostSlugsByLang(lang: string) {
  return fs
    .readdirSync(join(postsDirectory, lang))
    .filter((path) => path.endsWith('.md'))
}

export type FrontmatterContent = {
  title: string
  language: 'th'
  'language-en-link'?: string
  'language-th-link'?: string
  published: string
  categories: string
  keywords: string[]
  extracted: string
}

const postMap: { [key: string]: CompileMDXResult<FrontmatterContent> } = {}

export async function getPostBySlug(slug: string, lang?: string) {
  const key = `${slug}[${lang ?? 'th'}]`
  if (postMap[key]) {
    return postMap[key]
  }

  const post = fs.readFileSync(
    join(postsDirectory, lang ? `/${lang}` : '', `${slug}.md`),
    {
      encoding: 'utf-8'
    }
  )

  try {
    const mdxSource = await compileMDX<FrontmatterContent>({
      source: post,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [wikiLinkPlugin],
          rehypePlugins: [imageUrlTransformer, imageSizeEmbedder]
        }
      }
    })
    postMap[key] = mdxSource

    return mdxSource
  } catch (error) {
    console.trace(error)
    console.log('[POST]', post)
    throw new Error(`Parsed Failed "${key}"`)
  }
}

export function generatePostsStaticParams(lang?: string) {
  let files: string[]
  if (!lang) {
    files = getPostSlugs()
  } else {
    files = getPostSlugsByLang(lang)
  }

  if (process.env.NODE_ENV === 'development') {
    return files.map((file) => ({ slug: encodeURI(file.replace('.md', '')) }))
  }

  return files.map((file) => ({ slug: file.replace('.md', '') }))
}

export async function generatePostMetadata(
  slug: string,
  lang?: string
): Promise<Metadata> {
  const post = await getPostBySlug(decodeURI(slug), lang)
  const extracted = JSON.parse(post.frontmatter.extracted)

  return {
    title: post.frontmatter.title as string,
    description: extracted.summarize,
    keywords: extracted.keywords
  }
}
