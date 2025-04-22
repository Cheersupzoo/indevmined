import { NormalResponsive } from '@/components/Layout'
import React from 'react'
import TiptapEditor from './TiptapEditor'
import { Metadata } from 'next'
import AuthLayout from './AuthLayout'

export const metadata: Metadata = {
  title: 'Editor | In Dev Mined',
  description: 'In Dev Mined WYSIWYG Editor'
}

const page = () => {
  return (
    <AuthLayout>
      <NormalResponsive className='pb-8'>
        <TiptapEditor />
      </NormalResponsive>
    </AuthLayout>
  )
}

export default page
