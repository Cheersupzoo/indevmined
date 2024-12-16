import { compileMDX } from 'next-mdx-remote/rsc'
import imageUrlTransformer from './rehype/imageUrlTransformer'
import wikiLinkPlugin from 'remark-wiki-link'
import imageSizeEmbedder from './rehype/imageSizeEmbedder'
import imageVaultToPublic from './rehype/imageVaultToPublic'
import centerImageDescription from './rehype/centerImageDescription'
import remarkDirective from 'remark-directive'
import { pre } from './components/pre'
import { InlineCode } from './components/InlineCode'
import { img } from './components/img'
import rehypePreExtra from './rehype/rehypePreExtra'
import { ScrollyCoding } from './components/ScrollyCoding'
import { CodeWithMermaid } from './components/CodeWithMermaid'
import { remarkCodeHike, recmaCodeHike, CodeHikeConfig } from 'codehike/mdx'

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
      CodeWithMermaid
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          wikiLinkPlugin,
          remarkDirective,
          [remarkCodeHike, chConfig]
        ],
        rehypePlugins: [
          imageVaultToPublic,
          imageUrlTransformer,
          imageSizeEmbedder,
          centerImageDescription,
          rehypePreExtra
        ],
        recmaPlugins: [[recmaCodeHike, chConfig]]
      }
    }
  })
}
