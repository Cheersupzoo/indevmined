import { NormalResponsive } from '@/components/Layout'
import React from 'react'
import TiptapEditor from './TiptapEditor'
import { Metadata } from 'next'
import AuthLayout from './AuthLayout'
import EditorLayout from './EditorLayout'

export const metadata: Metadata = {
  title: 'Editor | In Dev Mined',
  description: 'In Dev Mined WYSIWYG Editor'
}

const page = () => {
  return (
    <AuthLayout>
      <EditorLayout>
        <NormalResponsive className='pb-8 sm:px-20 lg:px-0'>
          <TiptapEditor docId='example-document' />
        </NormalResponsive>
      </EditorLayout>
    </AuthLayout>
  )
}

export default page
