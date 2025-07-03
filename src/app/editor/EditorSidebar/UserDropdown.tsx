'use client'

import React, { useEffect } from 'react'

import { Memo, use$, useObservable } from '@legendapp/state/react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useAuth } from '../Auth/AuthProvider'

const UserDropdown = () => {
  const { user$, signout } = useAuth()

  const user = use$(user$)
  const swStatus$ = useObservable('Checking')

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration('/sw.js').then((reg) => {
        if (reg) {
          if (process.env.NODE_ENV === 'development') {
            reg.unregister()
          }
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
          <button className='flex items-center gap-2 rounded-md p-2 hover:bg-eva-text/10 data-[state=open]:bg-eva-text/5'>
            <div className='h-7 w-7 rounded-full bg-green-800 text-center text-sm leading-7'>
              {user.email?.[0].toUpperCase()}
            </div>
            <div className='w-24 overflow-hidden text-ellipsis whitespace-nowrap'>
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
          <div className='mt-2 px-2 text-xs text-eva-text-border'>
            SW Status: <Memo>{swStatus$}</Memo>
          </div>
          <div className='mt-2 px-2 text-xs text-eva-text-border'>
            Build ID: {process.env.NEXT_PUBLIC_BUILD_ID}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  )
}

export default UserDropdown
