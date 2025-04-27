import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import type { Observable } from '@legendapp/state'
import React from 'react'
import { useEditorContext, type TiptapDoc } from '../hooks/EditorProvider'
import { use$ } from '@legendapp/state/react'
import { cn } from '@/lib/utils'
import { PostMenuItemDropdown } from './PostMenuItemDropdown'
import { useDisplaySlugName } from '../hooks/useDisplaySlugName'
import './PostMenuItem.css'

export const PostMenuItem = ({
  item$: doc$
}: {
  item$: Observable<TiptapDoc>
}) => {
  const { docId$, setDocId } = useEditorContext()
  const name = use$(() => doc$.name.get())
  const selected = use$(() => doc$.name.get() === docId$.get())
  const displayName = useDisplaySlugName(name)  

  return (
    <SidebarMenuItem className='group/item cursor-pointer select-none'>
      <SidebarMenuButton asChild>
        <div
          onClick={() => setDocId(name)}
          className={cn('flex justify-between', selected && 'bg-eva-text/5')}
        >
          <div data-placeholder='Untitled' className='post-menu-item max-w-44 overflow-clip text-ellipsis'>{displayName}</div>
          <PostMenuItemDropdown docId={name} />
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
