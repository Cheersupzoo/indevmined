import { NormalResponsive } from '@/components/Layout'
import React from 'react'
import { Metadata } from 'next'
import AuthLayout from './Auth/AuthLayout'
import EditorLayout from './EditorLayout/EditorLayout'
import EditorProvider from './hooks/EditorProvider'
import Editor from './Editor'

export const metadata: Metadata = {
  title: 'Editor | In Dev Mined',
  description: 'In Dev Mined WYSIWYG Editor'
}

const page = () => {
  return (
    <AuthLayout>
      <EditorProvider>
        <EditorLayout>
          <NormalResponsive className='pb-8 sm:px-20 lg:px-0'>
            <Editor />
          </NormalResponsive>
        </EditorLayout>
      </EditorProvider>
    </AuthLayout>
  )
}

export default page
