'use client'

import React from 'react'
import { FaGoogle, FaTruckLoading } from 'react-icons/fa'
import AuthProvider, { useAuth } from './AuthProvider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { motion } from 'motion/react'

const AuthLayoutImpl = ({
  children,
  leading
}: React.PropsWithChildren<{ leading?: React.ReactElement }>) => {
  const { loading, login, user, authLoading, signout } = useAuth()

  if (loading) {
    return <></>
  }

  if (!user) {
    return (
      <div className='flex flex-col justify-center h-screen items-center gap-8'>
        <motion.div
          layoutId='editor-header'
          className='select-none text-eva-text/80 font-medium text-base'
        >
          InDevMined Editor
        </motion.div>
        <motion.button layout onClick={() => login()}>
          <motion.div
            layout='position'
            className='px-2 py-1 bg-slate-50 rounded-full flex items-center gap-1'
          >
            <FaGoogle /> Signin with Google {authLoading && <FaTruckLoading />}
          </motion.div>
        </motion.button>
      </div>
    )
  }

  return (
    <div className='flex flex-grow flex-col'>
      <header className='text-eva-text relative left-0 right-0 top-0 z-50 mx-auto  w-full max-w-2xl bg-transparent  px-4 sm:px-0'>
        <div className='flex items-center py-2 justify-between '>
          <div>{leading}</div>
          <motion.div
            layoutId='editor-header'
            className='select-none absolute left-1/2 -translate-x-1/2 text-eva-text/50 font-medium text-base'
          >
            InDevMined Editor
          </motion.div>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='bg-green-800 w-7 h-7 text-sm rounded-full'>
                  {user.email?.[0].toUpperCase()}
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
          )}
        </div>
      </header>
      {children}
    </div>
  )
}

const AuthLayout = ({
  children,
  leading
}: React.PropsWithChildren<{ leading?: React.ReactElement }>) => {
  return (
    <AuthProvider>
      <AuthLayoutImpl leading={leading}>{children}</AuthLayoutImpl>
    </AuthProvider>
  )
}

export default AuthLayout
