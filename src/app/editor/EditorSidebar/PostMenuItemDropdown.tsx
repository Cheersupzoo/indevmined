'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { EllipsisVertical } from 'lucide-react'
import React from 'react'
import { useEditorContext } from '../hooks/EditorProvider'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

export const PostMenuItemDropdown = ({ docId }: { docId: string }) => {
  const { deleteDoc } = useEditorContext()
  const isMobile = useIsMobile()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            'px-0.5 py-1 hover:bg-eva-text/10 rounded-sm',
            !isMobile &&
              'invisible group-hover/item:visible data-[state=open]:visible'
          )}
        >
          <EllipsisVertical size={16} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className='w-52'
      >
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => deleteDoc(docId)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
