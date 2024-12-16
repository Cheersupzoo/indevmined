import React from 'react'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
oneDark['pre[class*="language-"]'].margin = '0'
oneDark['pre[class*="language-"]'].borderRadius = '0'
import { Code } from './ScrollyCoding/Code'
import { RawCode } from 'codehike/code'

export const pre = (props: { codeblock: RawCode } | any) => {
  if (props.codeblock?.lang) {
    const language = props.codeblock.lang
    const code = props.codeblock.value.trimEnd()

    let name = props.codeblock.meta
    const isScrollable = props.codeblock.meta.includes('scroll')
    if (isScrollable) name = name.replace('scroll', '')
    const isCopyable = props.codeblock.meta.includes('!copy')
    if (isCopyable) name = name.replace('!copy', '')
    name = name.trim()

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
          codeblock={{
            lang: language,
            value: code,
            meta: `${language}${name.length ? ' | ' + name : ''}`
          }}
          copy={isCopyable}
        />
      </div>
    )
  }

  return <pre {...props} />
}
