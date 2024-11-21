import React from 'react'
import { highlight, Inline, RawCode } from 'codehike/code'

export const Code = async (props: any) => {
  const highlighted = await highlight(
    { value: props.children, lang: props.language, meta: '' } as RawCode,
    'dark-plus'
  )

  return <Inline className='px-0.5' code={highlighted} style={{...highlighted.style, fontSize: '0.9rem'}}  />
}
