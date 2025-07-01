import React from 'react'

import { type NodeViewProps } from '@tiptap/react'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

import { ReactLive } from './ReactLive'
import './style.css'

export const CodeBlockWrapper = (
  props: NodeViewProps & {
    Dropdown?: React.FunctionComponent<NodeViewProps>
    onClickLanguageSelector?: (
      event: React.MouseEvent,
      props: NodeViewProps
    ) => void
    Tag: React.FC | 'div'
    CodeRenderer: React.ReactElement
  }
) => {
  return (
    <props.Tag className='pre group relative flex flex-col rounded bg-zinc-800 shadow-xl'>
      <div contentEditable={false} className='absolute right-1.5 top-1.5'>
        {props.Dropdown && <props.Dropdown {...props} />}
      </div>
      <div
        contentEditable={false}
        className='py-2 text-center font-mono text-xs text-zinc-400'
      >
        <span
          className={cn('select-none', props.editor && 'cursor-pointer')}
          data-language-selector
          {...(props.onClickLanguageSelector && {
            onClick: (event) => props.onClickLanguageSelector?.(event, props),
          })}
        >
          {props.node.attrs.language}
          {props.editor && (
            <ChevronDown
              className='inline opacity-0 group-hover:opacity-100'
              size={16}
            />
          )}
        </span>
      </div>
      {!(
        props.node.attrs.preview && ['jsx', 'tsx', props.node.attrs.preview]
      ) ? (
        props.CodeRenderer
      ) : (
        <div className='grid grid-rows-[minmax(0,_1fr)_minmax(100px,_auto)] sm:grid-cols-2 sm:grid-rows-none'>
          <div className='border-b border-eva-text-border sm:border-b-0 sm:border-r'>
            {props.CodeRenderer}
          </div>
          <div contentEditable={false} className='p-2'>
            <ReactLive
              code={props.node.textContent}
              previewCenter={props.node.attrs.previewCenter}
            />
          </div>
        </div>
      )}
    </props.Tag>
  )
}
