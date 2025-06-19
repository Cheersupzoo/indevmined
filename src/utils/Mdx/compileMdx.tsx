import { CodeHikeConfig, recmaCodeHike, remarkCodeHike } from 'codehike/mdx'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkDirective from 'remark-directive'
import wikiLinkPlugin from 'remark-wiki-link'

import { CodeWithMermaid } from './components/CodeWithMermaid'
import { InlineCode } from './components/InlineCode'
import { ScrollyCoding } from './components/ScrollyCoding'
import { img } from './components/img'
import { pre } from './components/pre'
import centerImageDescription from './rehype/centerImageDescription'
import imageSizeEmbedder from './rehype/imageSizeEmbedder'
import imageUrlTransformer from './rehype/imageUrlTransformer'
import imageVaultToPublic from './rehype/imageVaultToPublic'
import rehypePreExtra from './rehype/rehypePreExtra'

export type PostMeta = FrontmatterContent & {
  slug: string
  en: {
    title?: string
    description?: string
    url: string
  } | null
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
  description?: string
}

const chConfig: CodeHikeConfig = {
  components: { code: 'Pre', inlineCode: 'Code' },
}

export function compiledOptionMDX(post: string) {
  return compileMDX<FrontmatterContent>({
    source: post,
    components: {
      // pre,
      Pre: pre,
      Code: InlineCode,
      img,
      ScrollyCoding,
      CodeWithMermaid,
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          wikiLinkPlugin,
          remarkDirective,
          [remarkCodeHike, chConfig],
        ],
        rehypePlugins: [
          imageVaultToPublic,
          imageUrlTransformer,
          imageSizeEmbedder,
          centerImageDescription,
          rehypePreExtra,
          rehypeSlug,
          rehypeAutolinkHeadings,
        ],
        recmaPlugins: [[recmaCodeHike, chConfig]],
      },
    },
  })
}
