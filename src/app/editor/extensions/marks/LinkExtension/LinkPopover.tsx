'use client'

import { useEffect, useRef } from 'react'

import { Memo, Show, useObservable } from '@legendapp/state/react'
import { $React } from '@legendapp/state/react-web'
import { Editor } from '@tiptap/core'
import { ReactRenderer, ReactRendererOptions } from '@tiptap/react'
import { Command } from 'cmdk'
import { BanIcon, ExternalLink, Link, Unlink } from 'lucide-react'

import { cn } from '@/lib/utils'

interface LinkPopoverProps {
  editor: Editor
  closePopup: () => void
  currentUrl: string
}

export const LinkPopover = ({
  editor,
  closePopup,
  currentUrl = '',
}: LinkPopoverProps) => {
  const url$ = useObservable(currentUrl)
  const isEditing$ = useObservable(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const onOpen = () => {
    const isId = currentUrl.startsWith('#')
    if (isId) {
      const element = document.getElementById(currentUrl.slice(1))
      if (element) {
        element.scrollIntoView()
      }
    } else {
      window.open(currentUrl, '_blank')
    }
    closePopup()
  }

  const onConfirm = () => {
    const url = url$.peek()
    if (!url?.length) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    }
    closePopup()
  }

  const onRemove = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    closePopup()
  }

  return (
    <Command>
      <div className='mx-2 py-0.5 text-xs text-eva-text/70'>Set link URL</div>
      <$React.input
        ref={inputRef}
        $value={url$}
        onChange={() => {
          isEditing$.set(true)
        }}
        placeholder='Enter URL'
        id='link-popover'
        className='w-full border-y border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-300 focus:border-zinc-500 focus:outline-none'
      />
      <Command.List className='mt-2'>
        <Show
          if={() => !isEditing$.get() && currentUrl.length}
          else={() => (
            <Command.Item
              onSelect={closePopup}
              className={cn(
                'cursor-pointer px-3 py-2 text-zinc-300 transition-colors hover:bg-zinc-800'
              )}
            >
              <BanIcon size={16} />
              Cancel change
            </Command.Item>
          )}
        >
          {() => (
            <Command.Item
              onSelect={onOpen}
              className={cn(
                'cursor-pointer px-3 py-2 text-zinc-300 transition-colors hover:bg-zinc-800'
              )}
            >
              <ExternalLink size={16} />{' '}
              {currentUrl.startsWith('#')
                ? 'Scroll to anchor'
                : 'Open link in new tab'}
            </Command.Item>
          )}
        </Show>
        <Memo>
          {() => (
            <Command.Item
              onSelect={onConfirm}
              className={cn(
                'cursor-pointer px-3 py-2 transition-colors hover:bg-zinc-800',
                url$.get()
                  ? 'text-zinc-300'
                  : 'cursor-not-allowed text-zinc-500'
              )}
              disabled={!url$.get()}
            >
              <Link size={16} /> Confirm
            </Command.Item>
          )}
        </Memo>
        <Command.Item
          onSelect={onRemove}
          className='cursor-pointer px-3 py-2 text-red-500 transition-colors hover:bg-zinc-800'
        >
          <Unlink size={16} /> Remove Link
        </Command.Item>
      </Command.List>
    </Command>
  )
}

export const LinkPopoverRenderer = (props: ReactRendererOptions) =>
  new ReactRenderer(LinkPopover, props)
