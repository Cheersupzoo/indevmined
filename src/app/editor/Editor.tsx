'use client'
import React from 'react'
import TiptapEditor from './TiptapEditor'
import { TiptapDoc, useEditorContext } from './hooks/EditorProvider'
import { For, Memo, Show, use$ } from '@legendapp/state/react'
import { AnimatePresence, motion } from 'motion/react'
import { PostMenuItem } from './EditorSidebar/PostMenuItem'
import { Observable } from '@legendapp/state'
import { SidebarMenu } from '@/components/ui/sidebar'
import { Spinner } from '@/components/Spinner'

const Editor = () => {
  const { docId$, docs$, createDoc } = useEditorContext()
  const docId = use$(docId$)

  if (!docId) {
    return (
      <div className='mt-8 text-eva-text/70 select-none'>
        <div className='text-eva-text mb-6'>
          Select below or tap to{' '}
          <span
            onClick={createDoc}
            className='border-b border-b-eva-text border-dashed cursor-pointer'
          >
            create
          </span>{' '}
          new post
        </div>
        <SidebarMenu>
          <Show if={() => !docs$.get()} wrap={AnimatePresence}>
            {() => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='ml-2 mt-2 absolute'
              >
                <Spinner />
              </motion.div>
            )}
          </Show>
          <Show if={docs$}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <For
                each={docs$ as Observable<TiptapDoc[]>}
                item={PostMenuItem}
              />
            </motion.div>
          </Show>
        </SidebarMenu>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {/* The `key` is for remount editor when docId change and reset state */}
      <TiptapEditor key={docId} docId={docId} />
    </AnimatePresence>
  )
}

export default Editor
