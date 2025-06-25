import React, { useState } from 'react'

import { Editor } from '@tiptap/core'
import { ChevronDown, PlusIcon } from 'lucide-react'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { suggestionBlock } from '../extensions/nodes/suggestionBlock'


export const InsertComponentDrawer = ({ editor }: { editor: Editor }) => {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className='flex items-center p-2'>
          <PlusIcon size={16} />
          <ChevronDown size={12} className='text-eva-text/50' />
        </button>
      </DrawerTrigger>
      <DrawerContent className='max-h-[calc(100%)] text-eva-text'>
        <DrawerHeader className='flex shrink-0 grow-0 items-stretch justify-center border-b border-b-eva-text/20 py-2'>
          <div className='flex-1'></div>
          <DrawerTitle className='flex-1 text-base font-bold leading-none'>
            Insert block
          </DrawerTitle>
          <DrawerClose asChild>
            <div className='flex flex-1 items-center justify-end'>
              <button className='text-[rgb(35,131,226)]'>Cancel</button>
            </div>
          </DrawerClose>
        </DrawerHeader>
        <div className='h-full overflow-y-auto'>
          <div className='mb-1 ml-5 mt-2 text-sm text-eva-text/70'>
            Basic blocks
          </div>
          <div className='border-t border-t-eva-text/20'>
            {suggestionBlock.map((block) => (
              <DrawerClose
                key={block.title}
                onClick={() => {
                  block.command({ editor, range: editor.state.selection })
                  editor.view.dom.focus()
                }}
                asChild
              >
                <div className='flex min-h-[44px] select-none items-center border-b border-b-eva-text/20 bg-eva-text/5 leading-[120%]'>
                  <block.icon className='ml-5 h-4 w-4 text-eva-text/50' />
                  <p className='ml-4'>{block.title}</p>
                  <div className='ml-auto mr-5 text-eva-text/50'>
                    {block.mdShortcut}
                  </div>
                </div>
              </DrawerClose>
            ))}
          </div>
          <div className='h-8' />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
