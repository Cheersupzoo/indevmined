'use client'

import React from 'react'

import { useIsMobile } from '@/hooks/use-mobile'
import { EllipsisVertical } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

import { useEditorContext } from '../hooks/EditorProvider'

export const PostMenuItemDropdown = ({ docId }: { docId: string }) => {
  const { deleteDoc } = useEditorContext()
  const isMobile = useIsMobile()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            'rounded-sm px-0.5 py-1 hover:bg-eva-text/10',
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
