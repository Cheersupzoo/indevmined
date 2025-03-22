import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { ChevronDown } from 'lucide-react'
import React from 'react'

export const CodeBlockWrapper = (props: NodeViewProps) => {
  return (
    <NodeViewWrapper className='bg-zinc-800 rounded shadow-xl flex flex-col relative pre group'>
      <div
        contentEditable={false}
        className='text-center text-zinc-400 text-xs py-2 font-mono '
      >
        <span
          className='cursor-pointer'
          onClick={() => {
            const language = window.prompt(
              'Change language',
              props.node.attrs.language
            )
            if (!language?.length) return
            props.updateAttributes({ language })
          }}
        >
          {props.node.attrs.language}
          <ChevronDown className='inline group-hover:opacity-100 opacity-0' size={16} />
        </span>
      </div>
      <NodeViewContent as='code' className='text-[0.9rem]' />
    </NodeViewWrapper>
  )
}
