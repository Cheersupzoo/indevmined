'use client'

import React from 'react'
import { FaGoogle, FaTruckLoading } from 'react-icons/fa'
import AuthProvider, { useAuth } from './AuthProvider'
import { motion } from 'motion/react'
import { Memo, use$ } from '@legendapp/state/react'

const AuthLayoutImpl = ({ children }: React.PropsWithChildren) => {
  const { loading$, login, user$, authLoading$ } = useAuth()

  const loading = use$(loading$)
  const user = use$(user$)

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
            <FaGoogle /> Signin with Google{' '}
            <Memo>{() => authLoading$.get() && <FaTruckLoading />}</Memo>
          </motion.div>
        </motion.button>
      </div>
    )
  }

  return <>{children}</>
}

const AuthLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <AuthProvider>
      <AuthLayoutImpl>{children}</AuthLayoutImpl>
    </AuthProvider>
  )
}

export default AuthLayout
