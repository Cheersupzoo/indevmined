import { Command } from 'cmdk'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Editor } from '@tiptap/core'
import { Memo, Show, useObservable } from '@legendapp/state/react'
import { $React } from '@legendapp/state/react-web'
import { BanIcon, ExternalLink, Link, Unlink } from 'lucide-react'

interface LinkPopoverProps {
  editor: Editor
  closePopup: () => void
  currentUrl: string
}

export const LinkPopover = ({
  editor,
  closePopup,
  currentUrl = ''
}: LinkPopoverProps) => {
  const url$ = useObservable(currentUrl)
  const isEditing$ = useObservable(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const onOpen = () => {
    window.open(currentUrl, '_blank')
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
      <div className='py-0.5 mx-2 text-xs text-eva-text/70'>Set link URL</div>
      <$React.input
        ref={inputRef}
        $value={url$}
        onChange={() => {
          isEditing$.set(true)
        }}
        placeholder='Enter URL'
        id='link-popover'
        className='w-full px-3 py-2 border-y border-zinc-700 bg-zinc-900 text-zinc-300 focus:outline-none focus:border-zinc-500'
      />
      <Command.List className='mt-2'>
        <Show
          if={() => !isEditing$.get() && currentUrl.length}
          else={() => (
            <Command.Item
              onSelect={closePopup}
              className={cn(
                'px-3 py-2 cursor-pointer hover:bg-zinc-800 transition-colors text-zinc-300'
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
                'px-3 py-2 cursor-pointer hover:bg-zinc-800 transition-colors text-zinc-300'
              )}
            >
              <ExternalLink size={16} /> Open link in new tab
            </Command.Item>
          )}
        </Show>
        <Memo>
          {() => (
            <Command.Item
              onSelect={onConfirm}
              className={cn(
                'px-3 py-2 cursor-pointer hover:bg-zinc-800 transition-colors',
                url$.get()
                  ? 'text-zinc-300'
                  : 'text-zinc-500 cursor-not-allowed'
              )}
              disabled={!url$.get()}
            >
              <Link size={16} /> Confirm
            </Command.Item>
          )}
        </Memo>
        <Command.Item
          onSelect={onRemove}
          className='px-3 py-2 cursor-pointer hover:bg-zinc-800 transition-colors text-red-500'
        >
          <Unlink size={16} /> Remove Link
        </Command.Item>
      </Command.List>
    </Command>
  )
}
