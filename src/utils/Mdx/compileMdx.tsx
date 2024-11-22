import { compileMDX } from 'next-mdx-remote/rsc'
import imageUrlTransformer from './rehype/imageUrlTransformer'
import wikiLinkPlugin from 'remark-wiki-link'
import imageSizeEmbedder from './rehype/imageSizeEmbedder'
import imageVaultToPublic from './rehype/imageVaultToPublic'
import centerImageDescription from './rehype/centerImageDescription'
import remarkDirective from 'remark-directive'
import { pre } from './components/pre'
import { Code } from './components/code'
import { img } from './components/img'
import { remarkCodeHikeDirective } from './remark/codeHikeDirective'
import rehypePreExtra from './rehype/rehypePreExtra'
import { CodeHike } from './components/codeHike'
export type PostMeta = FrontmatterContent & {
  slug: string
  en: {
    title?: string
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

export function compiledOptionMDX(post: string) {
  return compileMDX<FrontmatterContent>({
    source: post,
    components: {
      pre,
      Code,
      img,
      CodeHike
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          wikiLinkPlugin,
          remarkDirective,
          remarkCodeHikeDirective
        ],
        rehypePlugins: [
          imageVaultToPublic,
          imageUrlTransformer,
          imageSizeEmbedder,
          centerImageDescription,
          rehypePreExtra
        ]
      }
    }
  })
}
