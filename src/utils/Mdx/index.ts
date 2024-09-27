import { join } from 'path'
import fs from 'fs'
import { compileMDX, type CompileMDXResult } from 'next-mdx-remote/rsc'
import imageUrlTransformer from './rehype/imageUrlTransformer'
import wikiLinkPlugin from 'remark-wiki-link'
import imageSizeEmbedder from './rehype/imageSizeEmbedder'
import type { Metadata } from 'next'

const postsDirectory = join(process.cwd(), 'vault')

type Language = 'en' | 'th'

export function getPostFiles() {
  return fs.readdirSync(postsDirectory).filter((path) => path.endsWith('.md'))
}

function fileToSlug(file: string) {
  return file.replace('.md', '')
}

type PostMeta = FrontmatterContent & {
  slug: string
  en: {
    title: string
    url: string
  }
}

export async function getPostsMeta(): Promise<PostMeta[]> {
  const files = getPostFiles()
  const slugs = files.map((file) => fileToSlug(file))
  const postTHs = await Promise.all(slugs.map((slug) => getPostBySlug(slug)))
  postTHs.sort(
    (a, b) =>
      new Date(b.frontmatter.published).getTime() - new Date(a.frontmatter.published).getTime()
  )

  const postENs = await Promise.all(
    postTHs.map((post) =>
      getPostBySlug(
        parseMarkdownLink(post.frontmatter['language-en-link']!).slug,
        'en'
      )
    )
  )

  return postTHs.map((post, index) => ({
    ...post.frontmatter,
    slug: slugs[index],
    en: {
      title: postENs[index].frontmatter.title,
      url: parseMarkdownLink(post.frontmatter['language-en-link']!).url
    }
  }))
}

export function getPostSlugsByLang(lang: Language) {
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
  'reading-time': number
}

const postMap: { [key: string]: CompileMDXResult<FrontmatterContent> } = {}

export async function getPostBySlug(slug: string, lang?: Language) {
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

export function generatePostsStaticParams(lang?: Language) {
  let files: string[]
  if (!lang) {
    files = getPostFiles()
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
  lang?: Language
): Promise<Metadata> {
  const post = await getPostBySlug(decodeURI(slug), lang)
  const extracted = JSON.parse(post.frontmatter.extracted)

  return {
    title: post.frontmatter.title as string,
    description: extracted.summarize,
    keywords: extracted.keywords
  }
}

export function parseMarkdownLink(mdLink: string, lang = 'en') {
  const slug = mdLink.slice(2).slice(0, -2).split('|')[0].split('/').pop()
  if(!slug) {
    throw new Error("Fail to parse slug")
  }

  return {
    url: lang === 'th' ? `/post/${slug}` : `/${lang}/post/${slug}`,
    slug
  }
}
