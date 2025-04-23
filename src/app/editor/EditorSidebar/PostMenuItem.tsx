import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import type { Observable } from '@legendapp/state'
import React from 'react'
import { useEditorContext, type TiptapDoc } from '../EditorProvider'
import { use$ } from '@legendapp/state/react'
import { cn } from '@/lib/utils'

export const PostMenuItem = ({
  item$: doc$
}: {
  item$: Observable<TiptapDoc>
}) => {
  const { docId$ } = useEditorContext()
  const name = use$(() => doc$.name.get())
  const selected = use$(() => doc$.name.get() === docId$.get())

  return (
    <SidebarMenuItem
      onClick={() => docId$.set(name)}
      className='cursor-pointer select-none'
    >
      <SidebarMenuButton asChild>
        <div className={cn(selected && 'bg-eva-text/5')}>
          <span>{name}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
