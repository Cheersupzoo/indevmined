'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import React from 'react'
import { useAuth } from './AuthProvider'

const UserDropdown = () => {
  const { user, signout } = useAuth()

  return (
    user && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className='p-2 rounded-md flex items-center gap-2 data-[state=open]:bg-eva-text/5 hover:bg-eva-text/5'>
            <div className='leading-7 text-center bg-green-800 w-7 h-7 text-sm rounded-full'>
              {user.email?.[0].toUpperCase()}
            </div>
            <div>{user.email}</div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56'>
          <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={signout}>Log out</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  )
}

export default UserDropdown
