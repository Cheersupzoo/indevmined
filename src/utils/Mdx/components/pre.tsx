import React from 'react'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
oneDark['pre[class*="language-"]'].margin = '0'
oneDark['pre[class*="language-"]'].borderRadius = '0'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

export const pre = (props: any) => {
  if (
    props.children &&
    (props.children as any).props.className?.startsWith('language-')
  ) {
    const language = (props.children as any).props.className.replace(
      'language-',
      ''
    )
    const code = (props.children as any).props.children

    // @ts-ignore
    const isScrollable = props.scroll

    return (
      <pre>
        <div
          className='bg-slate-200 text-slate-800 pl-2 py-0.5 rounded-t-[.3em] text-xs'
          style={{ textTransform: 'uppercase' }}
        >
          {language}
        </div>
        <div
          className='rounded-b-[.3em]'
          style={{
            fontSize: '0.9rem'
          }}
        >
          <SyntaxHighlighter
            PreTag='div'
            language={language}
            style={{ ...oneDark }}
            showLineNumbers
            customStyle={{
              ...(isScrollable && {
                maxHeight: '400px'
                // overflow: 'auto'
              }),
              width: '100%',
              padding: '0 8px'
            }}
            // codeTagProps={{ style: { whiteSpace: 'pre-wrap' } }}
          >
            {String(code).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      </pre>
    )
  }

  return <pre {...props} />
}
