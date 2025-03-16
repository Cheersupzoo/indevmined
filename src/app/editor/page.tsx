import Layout, { NormalResponsive } from '@/components/Layout'
import React from 'react'
import TiptapEditor from './TiptapEditor'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editor | In Dev Mined',
  description: 'In Dev Mined WYSIWYG Editor'
}

const page = () => {
  return (
    <Layout footer={<></>}>
      <NormalResponsive className='pb-8'>
        <TiptapEditor />
      </NormalResponsive>
    </Layout>
  )
}

export default page
