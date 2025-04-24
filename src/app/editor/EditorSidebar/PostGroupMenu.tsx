import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu
} from '@/components/ui/sidebar'
import React from 'react'
import { TiptapDoc, useEditorContext } from '../hooks/EditorProvider'
import { For, Memo } from '@legendapp/state/react'
import { Observable } from '@legendapp/state'
import { PostMenuItem } from './PostMenuItem'
import { Plus } from 'lucide-react'
import { Spinner } from '@/components/Spinner'

export const PostGroupMenu = () => {
  const { docs$, createDoc } = useEditorContext()

  return (
    <SidebarGroup className=''>
      <SidebarGroupLabel className='flex justify-between'>
        <div>Posts</div>
        <div
          onClick={createDoc}
          className='hover:bg-eva-text/5 p-0.5 rounded-sm cursor-pointer'
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
