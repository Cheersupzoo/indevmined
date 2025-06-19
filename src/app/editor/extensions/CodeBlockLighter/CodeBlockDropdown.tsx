'use client'

import React from 'react'

import { useIsMobile } from '@/hooks/use-mobile'
import {
  EllipsisVertical,
  ImageIcon,
  ImageOffIcon,
  SquareSquareIcon,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export const CodeBlockDropdown = ({
  preview,
  togglePreview,
  center,
  toggleCenter,
}: {
  preview?: boolean
  togglePreview: () => void
  center?: boolean
  toggleCenter: () => void
}) => {
  const isMobile = useIsMobile()

  return (
    <div className='flex gap-1'>
      <div
        onClick={toggleCenter}
        className={cn(
          center && 'bg-eva-text/15',
          'rounded-sm px-0.5 py-1 hover:bg-eva-text/10',
          !isMobile && 'invisible group-hover:visible data-[state=open]:visible'
        )}
      >
        <SquareSquareIcon size={16} />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              'rounded-sm px-0.5 py-1 hover:bg-eva-text/10',
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
    </div>
  )
}
