import React from 'react'
import './style.css'

export const CodeWithMermaid = (props: {children: React.JSX.Element[]}) => {

  return (
    <div className='code-with-mermaid sm:grid  sm:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] '>
      {props.children[0]}
      <div className='bg-text/30 h-[1px] sm:h-full' />
      {props.children[1]}
    </div>
  )
}
