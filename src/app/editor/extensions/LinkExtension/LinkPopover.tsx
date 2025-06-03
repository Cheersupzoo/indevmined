import { Command } from 'cmdk'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Editor } from '@tiptap/core'
import { Memo, useObservable } from '@legendapp/state/react'
import { $React } from '@legendapp/state/react-web'

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
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

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
      <$React.input
        ref={inputRef}
        $value={url$}
        placeholder='Enter URL'
        className='w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-900 text-zinc-300 focus:outline-none focus:border-zinc-500'
      />
      <Command.List className='mt-2'>
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
              Confirm
            </Command.Item>
          )}
        </Memo>
        <Command.Item
          onSelect={onRemove}
          className='px-3 py-2 cursor-pointer hover:bg-zinc-800 transition-colors text-red-500'
        >
          Remove Link
        </Command.Item>
      </Command.List>
    </Command>
  )
}
