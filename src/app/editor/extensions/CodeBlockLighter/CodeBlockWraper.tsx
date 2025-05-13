import {
  Editor,
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
  ReactRenderer
} from '@tiptap/react'
import { ChevronDown } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import tippy from 'tippy.js'
import { Command } from 'cmdk'
import './style.css'
import { cn } from '@/lib/utils'
import { CodeBlockDropdown } from './CodeBlockDropdown'
import dynamic from 'next/dynamic'
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
            console.log(props.node.textContent)
            props.updateAttributes({
              preview: !props.node.attrs.preview
            })
          }}
        />
      </div>
      <div
        ref={codeEl}
        contentEditable={false}
        className='text-center text-zinc-400 text-xs py-2 font-mono '
      >
        <span
          ref={spanEl}
          className='cursor-pointer'
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
        <div className='grid grid-rows-2 sm:grid-rows-none sm:grid-cols-2'>
          <NodeViewContent
            as='code'
            className='text-[0.9rem] relative z-0 border-b sm:border-b-0 sm:border-r border-eva-text-border'
          />
          <div contentEditable={false} className='p-2 '>
            <LiveProvider code={props.node.textContent} noInline>
              <LiveError className='text-red-800 bg-red-100 mt-2' />
              <LivePreview />
            </LiveProvider>
          </div>
        </div>
      )}
    </NodeViewWrapper>
  )
}

const supportLanguages = [
  'css',
  'html',
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'python',
  'go',
  'rust'
]

const LanguageSelector = ({
  updateLanguage,
  closePopup,
  editor,
  currentLanguage
}: {
  updateLanguage: (language: string) => void
  closePopup: () => void
  editor: Editor
  currentLanguage: string
}) => {
  const [language, setLanguage] = useState(currentLanguage)
  const onValueChange = (language: string) => {
    if (!language?.length) return
    setLanguage(language)
  }

  const onSelected = (language: string) => {
    updateLanguage(language)
    closePopup()
    editor?.view.dom.focus()
  }
  const inputEl = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editor?.isFocused) {
      editor?.view.dom.blur()
    }
    inputEl.current?.focus()
  }, [editor])

  return (
    <Command
      onKeyDown={(event) => {
        if (event.code === 'Enter') {
          event.preventDefault()
          onSelected(language)
        }
      }}
      value={language}
      onValueChange={onValueChange}
    >
      <Command.Input
        ref={inputEl}
        className='bg-transparent outline-none px-3 pt-3 pb-3 border-b border-b-zinc-700 w-full'
        maxLength={16}
        placeholder='Programming language'
      />
      <Command.List className='px-2 mt-3 mb-3 text-left'>
        {supportLanguages.map((language) => (
          <Command.Item
            key={language}
            onSelect={onSelected}
            className={cn(language === currentLanguage && '!font-bold')}
          >
            {language}
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  )
}
