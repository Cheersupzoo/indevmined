import {
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
  ReactRenderer
} from '@tiptap/react'
import { ChevronDown } from 'lucide-react'
import React, { useRef } from 'react'
import tippy from 'tippy.js'
import './style.css'
import { CodeBlockDropdown } from './CodeBlockDropdown'
import dynamic from 'next/dynamic'
import { LanguageSelector } from './LanguageSelector'
const LiveProvider = dynamic(
  () => import('react-live').then((m) => m.LiveProvider),
  { ssr: false }
)
const LivePreview = dynamic(
  () => import('react-live').then((m) => m.LivePreview),
  { ssr: false }
)
const LiveError = dynamic(() => import('react-live').then((m) => m.LiveError), {
  ssr: false
})

export const CodeBlockWrapper = (props: NodeViewProps) => {
  const codeEl = useRef<HTMLDivElement>(null)
  const spanEl = useRef<HTMLDivElement>(null)

  return (
    <NodeViewWrapper className='bg-zinc-800 rounded shadow-xl flex flex-col relative pre group'>
      <div contentEditable={false} className='absolute top-1.5 right-1.5'>
        <CodeBlockDropdown
          preview={props.node.attrs.preview}
          togglePreview={() => {
            props.updateAttributes({
              preview: !props.node.attrs.preview
            })
          }}
          center={props.node.attrs.previewCenter}
          toggleCenter={() =>
            props.updateAttributes({
              previewCenter: !props.node.attrs.previewCenter
            })
          }
        />
      </div>
      <div
        ref={codeEl}
        contentEditable={false}
        className='text-center text-zinc-400 text-xs py-2 font-mono '
      >
        <span
          ref={spanEl}
          className='cursor-pointer select-none'
          data-language-selector
          onClick={(event) => {
            const component = new ReactRenderer(LanguageSelector, {
              editor: props.editor,
              props: {
                currentLanguage: props.node.attrs.language
              }
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
                    bottom: 0
                  } as DOMRect
                }
                const pos = spanEl.current.getBoundingClientRect()

                return pos
              },
              content: component.element,
              showOnCreate: true,
              interactive: true,
              trigger: 'manual',
              placement: 'bottom-start'
            })
            component.updateProps({
              editor: props.editor,
              updateLanguage: (language: string) =>
                props.updateAttributes({ language }),
              closePopup: () => popup.hide()
            })
          }}
        >
          {props.node.attrs.language}
          <ChevronDown
            className='inline group-hover:opacity-100 opacity-0'
            size={16}
          />
        </span>
      </div>
      {!(
        props.node.attrs.preview && ['jsx', 'tsx', props.node.attrs.preview]
      ) ? (
        <NodeViewContent as='code' className='text-[0.9rem] relative z-0' />
      ) : (
        <div className='grid grid-rows-[minmax(0,_1fr)_minmax(100px,_auto)] sm:grid-rows-none sm:grid-cols-2'>
          <NodeViewContent
            as='code'
            className='text-[0.9rem] relative z-0 border-b sm:border-b-0 sm:border-r border-eva-text-border'
          />
          <div contentEditable={false} className='p-2 '>
            <LiveProvider code={props.node.textContent} noInline>
              <LiveError className='text-red-800 bg-red-100 mt-2' />
              {!props.node.attrs.previewCenter ? (
                <LivePreview />
              ) : (
                <div className='flex justify-center items-center h-full'>
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
