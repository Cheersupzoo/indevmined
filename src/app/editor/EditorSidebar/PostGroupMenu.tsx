import React from 'react'

import { Observable } from '@legendapp/state'
import { For, Memo } from '@legendapp/state/react'
import { Plus } from 'lucide-react'

import { Spinner } from '@/components/Spinner'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar'

import { TiptapDoc, useEditorContext } from '../hooks/EditorProvider'
import { PostMenuItem } from './PostMenuItem'

export const PostGroupMenu = () => {
  const { docs$, createDoc } = useEditorContext()
  const { toggleSidebar } = useSidebar()

  return (
    <SidebarGroup className=''>
      <SidebarGroupLabel className='flex justify-between'>
        <div>Posts</div>
        <div
          onClick={() => {
            createDoc()
            toggleSidebar()
          }}
          className='cursor-pointer rounded-sm p-0.5 hover:bg-eva-text/10'
        >
          <Plus size={16} />
        </div>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <Memo>
            {() =>
              !docs$.get() && (
                <div className='ml-2 mt-2'>
                  <Spinner />
                </div>
              )
            }
          </Memo>
          <For each={docs$ as Observable<TiptapDoc[]>} item={PostMenuItem} />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
