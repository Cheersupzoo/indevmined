import { join } from 'path'
import fs from 'fs'
import { compileMDX, type CompileMDXResult } from 'next-mdx-remote/rsc'
import imageUrlTransformer from './rehype/imageUrlTransformer'
import wikiLinkPlugin from 'remark-wiki-link'
import imageSizeEmbedder from './rehype/imageSizeEmbedder'
import type { Metadata } from 'next'
import imageVaultToPublic from './rehype/imageVaultToPublic'
import centerImageDescription from './rehype/centerImageDescription'
import rehypeMdxCodeProps from 'rehype-mdx-code-props'
import { pre } from './components/pre'
import { Code } from './components/code'
import { img } from './components/img'

const postsDirectory = join(process.cwd(), 'vault')

type Language = 'en' | 'th'

export function getPostFiles() {
  return fs
    .readdirSync(postsDirectory)
    .filter((path) => path.endsWith('.md') || path.endsWith('.mdx'))
}

function fileToSlug(file: string) {
  return file.replace('.mdx', '').replace('.md', '')
}

export type PostMeta = FrontmatterContent & {
  slug: string
  en: {
    title?: string
    url: string
  } | null
}

export async function getPostsMeta(): Promise<PostMeta[]> {
  const files = getPostFiles()
  const slugs = files.map((file) => fileToSlug(file))
  let postTHs = await Promise.all(slugs.map((slug) => getPostBySlug(slug)))

  postTHs = postTHs
    .map((post, index) => ({
      ...post,
      frontmatter: { ...post.frontmatter, slug: slugs[index] }
    }))
    .filter((post) => {
      return !post.frontmatter.draft
    })

  postTHs.sort(
    (a, b) =>
      new Date(b.frontmatter.published).getTime() -
      new Date(a.frontmatter.published).getTime()
  )

  const postENs = await Promise.all(
    postTHs.map((post) =>
      post.frontmatter['language-en-link']
        ? getPostBySlug(
            parseMarkdownLink(post.frontmatter['language-en-link']!).slug,
            'en'
          )
        : null
    )
  )

  return postTHs.map((post, index) => ({
    ...post.frontmatter,
    en: postENs?.[index]
      ? {
          title: postENs?.[index]?.frontmatter.title,
          url: parseMarkdownLink(post.frontmatter['language-en-link']!).url
        }
      : null
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
  draft: boolean
  /** Generated */
  slug: string
}

const postMap: { [key: string]: CompileMDXResult<FrontmatterContent> } = {}

export async function getPostBySlug(rawSlug: string, lang?: Language) {
  const slug = decodeURIComponent(rawSlug)

  const key = `${slug}[${lang ?? 'th'}]`
  if (process.env.NODE_ENV !== 'development' && postMap[key]) {
    return postMap[key]
  }
  let post
  try {
    post = fs.readFileSync(
      join(postsDirectory, lang ? `/${lang}` : '', `${slug}.md`),
      {
        encoding: 'utf-8'
      }
    )
  } catch {
    post = fs.readFileSync(
      join(postsDirectory, lang ? `/${lang}` : '', `${slug}.mdx`),
      {
        encoding: 'utf-8'
      }
    )
  }

  try {
    const mdxSource = await compileMDX<FrontmatterContent>({
      source: post,
      components: {
        pre,
        Code,
        img,
        Custom: function (props) {
          console.log('🚀 ~ getPostBySlug ~ props:', props)
          return <p>123</p>
        }
      },

      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [wikiLinkPlugin],
          rehypePlugins: [
            imageVaultToPublic,
            imageUrlTransformer,
            imageSizeEmbedder,
            centerImageDescription,
            rehypeMdxCodeProps
          ]
        }
      }
    }).catch((e) => {
      console.log(`RETRY PARSE: ${key}`)

      return compileMDX<FrontmatterContent>({
        source: post,
        options: {
          parseFrontmatter: true,
          mdxOptions: {
            remarkPlugins: [wikiLinkPlugin],
            rehypePlugins: [
              imageVaultToPublic,
              imageUrlTransformer,
              imageSizeEmbedder,
              centerImageDescription,
              rehypeMdxCodeProps
            ]
          }
        }
      })
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
    const encodedFiles = files.map((file) => ({
      slug: encodeURI(fileToSlug(file))
    }))

    return encodedFiles
  }

  return files.map((file) => ({
    slug: fileToSlug(file)
  }))
}

export async function generatePostMetadata(
  slug: string,
  lang?: Language
): Promise<Metadata> {
  const post = await getPostBySlug(decodeURI(slug), lang)
  if (!post.frontmatter.extracted) {
    return { title: post.frontmatter.title as string }
  }
  const extracted = JSON.parse(post.frontmatter.extracted)

  return {
    title: post.frontmatter.title as string,
    description: extracted.summarize,
    keywords: extracted.keywords
  }
}

export function parseMarkdownLink(mdLink: string, lang = 'en') {
  const slug = mdLink.slice(2).slice(0, -2).split('|')[0].split('/').pop()
  if (!slug) {
    throw new Error('Fail to parse slug')
  }

  return {
    url: lang === 'th' ? `/post/${slug}` : `/${lang}/post/${slug}`,
    slug
  }
}
