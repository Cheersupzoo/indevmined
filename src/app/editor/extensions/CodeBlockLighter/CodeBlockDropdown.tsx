'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { EllipsisVertical, ImageIcon, ImageOffIcon } from 'lucide-react'
import React from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

export const CodeBlockDropdown = ({
  preview,
  togglePreview
}: {
  preview?: boolean
  togglePreview: () => void
}) => {
  const isMobile = useIsMobile()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            'px-0.5 py-1 hover:bg-eva-text/10 rounded-sm',
            !isMobile &&
              'invisible group-hover:visible data-[state=open]:visible'
          )}
        >
          <EllipsisVertical size={16} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className='w-40'
      >
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={togglePreview}>
            Preview{' '}
            {preview ? (
              <ImageIcon className='ml-auto' size={16} />
            ) : (
              <ImageOffIcon className='ml-auto' size={16} />
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
