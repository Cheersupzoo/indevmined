import { join } from 'path'
import fs from 'fs'
import { compileMDX } from 'next-mdx-remote/rsc'
import imageUrlTransformer from './rehype/imageUrlTransformer'
import wikiLinkPlugin from 'remark-wiki-link'

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
}

export async function getPostBySlug(slug: string, lang?: string) {
  const post = fs.readFileSync(
    join(postsDirectory, lang ? `/${lang}` : '', `${slug}.md`),
    {
      encoding: 'utf-8'
    }
  )

  const mdxSource = await compileMDX<FrontmatterContent>({
    source: post,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [wikiLinkPlugin],
        rehypePlugins: [imageUrlTransformer]
      }
    }
  })

  return mdxSource
}

export function generatePostsStaticParams(lang?: string) {
  let files: string[]
  if(!lang) {
    files = getPostSlugs()
  } else {
    files = getPostSlugsByLang(lang)
  }

  if (process.env.NODE_ENV === 'development') {
    return files.map((file) => ({ slug: encodeURI(file.replace('.md', '')) }))
  }

  return files.map((file) => ({ slug: file.replace('.md', '') }))
}
