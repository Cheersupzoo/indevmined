import { useEffect, useRef, useState } from 'react'

import { type Editor } from '@tiptap/core'
import { Command } from 'cmdk'

import { cn } from '@/lib/utils'

const supportLanguages = [
  'css',
  'html',
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'python',
  'go',
  'rust',
]

export const LanguageSelector = ({
  updateLanguage,
  closePopup,
  editor,
  currentLanguage,
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
        className='w-full border-b border-b-zinc-700 bg-transparent px-3 pb-3 pt-3 outline-none'
        maxLength={16}
        placeholder='Programming language'
      />
      <Command.List className='mb-3 mt-3 px-2 text-left'>
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
