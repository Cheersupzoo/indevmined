import Layout, { NormalResponsive } from '@/components/Layout'
import React from 'react'
import TiptapEditor from './TiptapEditor'

const page = () => {
  return (
    <Layout footer={<></>}>
      <NormalResponsive className='pb-8'><TiptapEditor /></NormalResponsive>
    </Layout>
  )
}

export default page