'use client'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import { AppSidebar } from './EditorSidebar'
import { EditorHeader } from './EditorHeader'

const EditorLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full'>
        <div className='flex flex-grow flex-col'>
          <EditorHeader />
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}

export default EditorLayout
