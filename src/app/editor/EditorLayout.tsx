'use client'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import { AppSidebar } from './EditorSidebar'
import { motion } from 'motion/react'
import { useEditorContext } from './EditorProvider'
import { Memo } from '@legendapp/state/react'

const EditorLayout = ({ children }: React.PropsWithChildren) => {
  const { docId$ } = useEditorContext()

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full'>
        <div className='flex flex-grow flex-col'>
          <div className='text-eva-text relative left-0 right-0 top-0 z-50 mx-auto  w-full bg-transparent px-3'>
            <div className='flex items-center py-2 justify-between '>
              <div className='flex gap-1 items-center'>
                <SidebarTrigger />
                <div className='text-eva-text hover:bg-eva-text/5 px-1.5 rounded-md'>
                  <Memo>{docId$}</Memo>
                </div>
              </div>
              <motion.div
                layoutId='editor-header'
                className='select-none absolute left-1/2 -translate-x-1/2 text-eva-text/50 font-medium text-base'
              >
                InDevMined Editor
              </motion.div>
            </div>
          </div>
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}

export default EditorLayout
