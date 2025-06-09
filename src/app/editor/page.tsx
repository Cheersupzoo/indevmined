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
    <NormalResponsive className='sm:px-20 lg:px-0'>
      <Editor />
    </NormalResponsive>
  )
}

export default page
