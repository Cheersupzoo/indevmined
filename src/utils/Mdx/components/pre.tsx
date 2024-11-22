import React from 'react'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
oneDark['pre[class*="language-"]'].margin = '0'
oneDark['pre[class*="language-"]'].borderRadius = '0'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { Code } from './codeHike/Code'

export const pre = (props: any) => {
  if (
    props.children &&
    (props.children as any).props?.className?.startsWith('language-')
  ) {
    const language = (props.children as any).props.className.replace(
      'language-',
      ''
    )
    const code = (props.children as any).props.children

    // @ts-ignore
    const isScrollable = props.scroll
    const isCopyable = props['!copy']

    return (
      <div
        className='bg-zinc-800 rounded shadow-xl flex flex-col relative'
        style={{
          ...(isScrollable && {
            maxHeight: '400px'
          })
        }}
      >
        <Code
          codeblock={{ lang: language, value: code, meta: language }}
          copy={isCopyable}
        />
      </div>
    )
  }

  return <pre {...props} />
}
