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

export const CodeBlockWrapper = (props: NodeViewProps) => {
  const codeEl = useRef<HTMLDivElement>(null)

  return (
    <NodeViewWrapper className='bg-zinc-800 rounded shadow-xl flex flex-col relative pre group'>
      <div
        ref={codeEl}
        contentEditable={false}
        className='text-center text-zinc-400 text-xs py-2 font-mono '
      >
        <span
          className='cursor-pointer'
          data-language-selector
          onClick={() => {
            const component = new ReactRenderer(LanguageSelector, {
              editor: props.editor,
              props: {
                currentLanguage: props.node.attrs.language
              }
            })

            const popup = tippy('[data-language-selector]', {
              appendTo: () => codeEl.current as Element,
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
              closePopup: () => popup[0]?.hide()
            })
            popup[0]?.show()
          }}
        >
          {props.node.attrs.language}
          <ChevronDown
            className='inline group-hover:opacity-100 opacity-0'
            size={16}
          />
        </span>
      </div>
      <NodeViewContent as='code' className='text-[0.9rem] relative z-0' />
    </NodeViewWrapper>
  )
}

const supportLanguages = [
  'css',
  'html',
  'javascript',
  'typescript',
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
        className='bg-transparent outline-none px-2 pt-3 pb-3 border-b border-b-zinc-700'
        maxLength={16}
        placeholder='Programming language'
      />
      <Command.List className='px-2 mt-3 mb-3 text-left'>
        {supportLanguages.map((language) => (
          <Command.Item key={language} onSelect={onSelected}>
            {language}
          </Command.Item>
        ))}
      </Command.List>
    </Command>
  )
}
