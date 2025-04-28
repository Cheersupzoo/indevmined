import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import type { Observable } from '@legendapp/state'
import React from 'react'
import { useEditorContext, type TiptapDoc } from '../hooks/EditorProvider'
import { use$ } from '@legendapp/state/react'
import { cn } from '@/lib/utils'
import { PostMenuItemDropdown } from './PostMenuItemDropdown'
import { useDisplaySlugName } from '../hooks/useDisplaySlugName'
import './PostMenuItem.css'
import { FileText } from 'lucide-react'

export const PostMenuItem = ({
  item$: doc$
}: {
  item$: Observable<TiptapDoc>
}) => {
  const { docId$, setDocId } = useEditorContext()
  const name = use$(() => doc$.name.get())
  const selected = use$(() => doc$.name.get() === docId$.get())
  const displayName = useDisplaySlugName(name)
  const { toggleSidebar, openMobile } = useSidebar()

  return (
    <SidebarMenuItem className='group/item cursor-pointer select-none'>
      <SidebarMenuButton asChild>
        <div
          onClick={() => {
            setDocId(name)
            if (openMobile) toggleSidebar()
          }}
          className={cn('flex justify-between', selected && 'bg-eva-text/5')}
        >
          <div className='flex items-center gap-3'>
            <FileText size={16} className='text-eva-text/50' />
            <div
              data-placeholder='Untitled'
              className='post-menu-item max-w-44 overflow-clip text-ellipsis'
            >
              {displayName}
            </div>
          </div>
          <PostMenuItemDropdown docId={name} />
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
