import React from 'react'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
oneDark['pre[class*="language-"]'].margin = '0'
oneDark['pre[class*="language-"]'].borderRadius = '4px'
oneDark['pre[class*="language-"]'].padding = '2px'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

export const Code = (props: any) => {
  return (
    <SyntaxHighlighter
      PreTag='span'
      language={props.language}
      style={{ ...oneDark }}
      customStyle={{ fontSize: '0.8rem' }}
    >
      {String(props.children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  )
}
