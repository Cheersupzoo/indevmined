'use client'
import React from 'react'
import TiptapEditor from './TiptapEditor'
import { useEditorContext } from './EditorProvider'
import { use$ } from '@legendapp/state/react'
import { AnimatePresence } from 'motion/react'

const Editor = () => {
  const { docId$ } = useEditorContext()
  const docId = use$(docId$)

  if (!docId) {
    return (
      <div className='mt-8 text-eva-text/70 select-none'>
        Select posts from sidebar
      </div>
    )
  }

  return (
    <AnimatePresence>
      <TiptapEditor key={docId} docId={docId} />
    </AnimatePresence>
  )
}

export default Editor
