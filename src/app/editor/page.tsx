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
    <AuthLayout leading={<div className='text-eva-text hover:bg-eva-text/5 px-1.5 -mx-1.5 rounded-md'>example-document</div>}>
      <NormalResponsive className='pb-8'>
        <TiptapEditor docId='example-document' />
      </NormalResponsive>
    </AuthLayout>
  )
}

export default page
