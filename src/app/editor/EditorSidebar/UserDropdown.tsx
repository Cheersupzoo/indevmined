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
import React, { useEffect } from 'react'
import { useAuth } from '../Auth/AuthProvider'
import { Memo, use$, useObservable } from '@legendapp/state/react'

const UserDropdown = () => {
  const { user$, signout } = useAuth()

  const user = use$(user$)
  const swStatus$ = useObservable('Checking')

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration('/sw.js').then((reg) => {
        if (reg) {
          if (reg.active) {
            swStatus$.set(reg.active.state)
          }
          if (reg.installing) {
            swStatus$.set(reg.installing.state)
          }
          if (reg.waiting) {
            swStatus$.set(reg.waiting.state)
          }
        } else {
          swStatus$.set('Not Found')
        }
      })
    }
  })

  return (
    user && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className='p-2 rounded-md flex items-center gap-2 data-[state=open]:bg-eva-text/5 hover:bg-eva-text/10'>
            <div className='leading-7 text-center bg-green-800 w-7 h-7 text-sm rounded-full'>
              {user.email?.[0].toUpperCase()}
            </div>
            <div className='text-ellipsis w-24 overflow-hidden whitespace-nowrap'>
              {user.email}
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56'>
          <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                signout()
                document.body.style.pointerEvents = ''
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <div className='px-2 mt-2 text-xs text-eva-text-border'>
            SW Status: <Memo>{swStatus$}</Memo>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  )
}

export default UserDropdown
