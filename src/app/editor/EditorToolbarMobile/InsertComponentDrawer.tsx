import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { ChevronDown, PlusIcon } from 'lucide-react'
import React, { useState } from 'react'
import { suggestionBlock } from '../extensions/InsertableBlock'
import { Editor } from '@tiptap/core'

export const InsertComponentDrawer = ({ editor }: { editor: Editor }) => {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className='p-2 flex items-center'>
          <PlusIcon size={16} />
          <ChevronDown size={12} className='text-eva-text/50' />
        </div>
      </DrawerTrigger>
      <DrawerContent className='text-eva-text max-h-[calc(100%)] '>
        <DrawerHeader className='py-2 border-b border-b-eva-text/20 flex items-stretch justify-center grow-0 shrink-0'>
          <div className='flex-1'></div>
          <DrawerTitle className='leading-none flex-1 text-base font-bold'>
            Insert block
          </DrawerTitle>
          <DrawerClose asChild>
            <div className='flex-1 flex justify-end items-center'>
              <button className='text-[rgb(35,131,226)]'>Cancel</button>
            </div>
          </DrawerClose>
        </DrawerHeader>
        <div className='overflow-y-auto h-full'>
          <div className='ml-5 text-sm text-eva-text/70 mb-1 mt-2'>
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
                <div className='flex bg-eva-text/5 items-center leading-[120%] select-none min-h-[44px] border-b border-b-eva-text/20'>
                  <block.icon className='ml-5 w-4 h-4 text-eva-text/50' />
                  <p className='ml-4'>{block.title}</p>
                  <div className='ml-auto text-eva-text/50 mr-5'>
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
