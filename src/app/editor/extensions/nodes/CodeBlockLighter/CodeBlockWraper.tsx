'use client'
import dynamic from 'next/dynamic'
import React, { useRef } from 'react'

import {
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  ReactRenderer,
} from '@tiptap/react'
import { ChevronDown } from 'lucide-react'
import tippy from 'tippy.js'

import { CodeBlockDropdown } from './CodeBlockDropdown'
import { LanguageSelector } from './LanguageSelector'
import './style.css'

const LiveProvider = dynamic(
  () => import('react-live').then((m) => m.LiveProvider),
  { ssr: false }
)
const LivePreview = dynamic(
  () => import('react-live').then((m) => m.LivePreview),
  { ssr: false }
)
const LiveError = dynamic(() => import('react-live').then((m) => m.LiveError), {
  ssr: false,
})

export const CodeBlockWrapper = (props: NodeViewProps) => {
  const codeEl = useRef<HTMLDivElement>(null)
  const spanEl = useRef<HTMLDivElement>(null)

  return (
    <NodeViewWrapper className='pre group relative flex flex-col rounded bg-zinc-800 shadow-xl'>
      <div contentEditable={false} className='absolute right-1.5 top-1.5'>
        <CodeBlockDropdown
          preview={props.node.attrs.preview}
          togglePreview={() => {
            props.updateAttributes({
              preview: !props.node.attrs.preview,
            })
          }}
          center={props.node.attrs.previewCenter}
          toggleCenter={() =>
            props.updateAttributes({
              previewCenter: !props.node.attrs.previewCenter,
            })
          }
        />
      </div>
      <div
        ref={codeEl}
        contentEditable={false}
        className='py-2 text-center font-mono text-xs text-zinc-400'
      >
        <span
          ref={spanEl}
          className='cursor-pointer select-none'
          data-language-selector
          onClick={(event) => {
            const component = new ReactRenderer(LanguageSelector, {
              editor: props.editor,
              props: {
                currentLanguage: props.node.attrs.language,
              },
            })

            const popup = tippy(event.currentTarget, {
              appendTo: () => codeEl.current as Element,
              getReferenceClientRect: () => {
                if (!spanEl.current) {
                  return {
                    width: 0,
                    height: 0,
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                  } as DOMRect
                }
                const pos = spanEl.current.getBoundingClientRect()

                return pos
              },
              content: component.element,
              showOnCreate: true,
              interactive: true,
              trigger: 'manual',
              placement: 'bottom-start',
            })
            component.updateProps({
              editor: props.editor,
              updateLanguage: (language: string) =>
                props.updateAttributes({ language }),
              closePopup: () => popup.hide(),
            })
          }}
        >
          {props.node.attrs.language}
          <ChevronDown
            className='inline opacity-0 group-hover:opacity-100'
            size={16}
          />
        </span>
      </div>
      {!(
        props.node.attrs.preview && ['jsx', 'tsx', props.node.attrs.preview]
      ) ? (
        <NodeViewContent as='code' className='relative z-0 text-[0.9rem]' />
      ) : (
        <div className='grid grid-rows-[minmax(0,_1fr)_minmax(100px,_auto)] sm:grid-cols-2 sm:grid-rows-none'>
          <NodeViewContent
            as='code'
            className='relative z-0 border-b border-eva-text-border text-[0.9rem] sm:border-b-0 sm:border-r'
          />
          <div contentEditable={false} className='p-2'>
            <LiveProvider code={props.node.textContent} noInline>
              <LiveError className='mt-2 bg-red-100 text-red-800' />
              {!props.node.attrs.previewCenter ? (
                <LivePreview />
              ) : (
                <div className='flex h-full items-center justify-center'>
                  {' '}
                  <LivePreview />
                </div>
              )}
            </LiveProvider>
          </div>
        </div>
      )}
    </NodeViewWrapper>
  )
}

export const CodeBlockWrapperRenderer =  ReactNodeViewRenderer(CodeBlockWrapper, {
  as: 'pre',
  attrs: {
    spellcheck: 'false',
    autocorrect: 'off',
    autocapitalize: 'off',
    translate: 'no',
  },
})