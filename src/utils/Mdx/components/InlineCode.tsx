import React from 'react'
import { highlight, HighlightedCode, Inline, RawCode } from 'codehike/code'

export const InlineCode = async (props: any) => {
  let highlighted: HighlightedCode

  if (props.codeblock) {
    highlighted = await highlight(props.codeblock, 'dark-plus')
  } else {
    highlighted = await highlight(
      { value: props.children, lang: props.language, meta: '' } as RawCode,
      'dark-plus'
    )
  }

  return (
    <Inline
      className='px-0.5'
      code={highlighted}
      style={{ ...highlighted.style, fontSize: '0.9rem' }}
    />
  )
}
