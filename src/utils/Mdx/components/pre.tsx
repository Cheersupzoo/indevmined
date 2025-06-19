import React from 'react'

import { RawCode } from 'codehike/code'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { Code } from './ScrollyCoding/Code'

oneDark['pre[class*="language-"]'].margin = '0'
oneDark['pre[class*="language-"]'].borderRadius = '0'

export const pre = (props: { codeblock: RawCode } | any) => {
  if (props.codeblock?.lang) {
    const language = props.codeblock.lang
    const code = props.codeblock.value.trimEnd()

    let name = props.codeblock.meta
    const parseMeta = (key: string) => {
      const keyExist = props.codeblock.meta.includes(key)
      if (keyExist) name = name.replace(key, '')

      return keyExist
    }
    const isScrollable = parseMeta('scroll')
    const isCopyable = parseMeta('!copy')
    const isCollapsible = parseMeta('@collapse')
    const isNoWrap = parseMeta('@noWrap')
    name = name.trim()

    return (
      <div
        className='pre relative flex flex-col rounded bg-zinc-800 shadow-xl'
        style={{
          ...(isScrollable && {
            maxHeight: '400px',
          }),
        }}
      >
        <Code
          codeblock={{
            lang: language,
            value: code,
            meta: `${language}${name.length ? ' | ' + name : ''}`,
          }}
          copy={isCopyable}
          collapse={isCollapsible}
          noWrap={isNoWrap}
        />
      </div>
    )
  }

  return <pre {...props} />
}
