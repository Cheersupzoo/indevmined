import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu
} from '@/components/ui/sidebar'
import React from 'react'
import { TiptapDoc, useEditorContext } from '../EditorProvider'
import { For } from '@legendapp/state/react'
import { Observable } from '@legendapp/state'
import { PostMenuItem } from './PostMenuItem'

export const PostGroupMenu = () => {
  const { docs$ } = useEditorContext()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Posts</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <For each={docs$ as Observable<TiptapDoc[]>} item={PostMenuItem} />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
