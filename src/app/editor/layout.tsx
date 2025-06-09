import React from 'react'
import EditorLayout from './EditorLayout/EditorLayout'
import AuthLayout from './Auth/AuthLayout'
import EditorProvider from './hooks/EditorProvider'

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <AuthLayout>
      <EditorProvider>
        <EditorLayout>{children}</EditorLayout>
      </EditorProvider>
    </AuthLayout>
  )
}
