'use client'

import React from 'react'

import { Observable } from '@legendapp/state'
import { For, Memo, Show, use$ } from '@legendapp/state/react'
import { AnimatePresence, motion } from 'motion/react'

import { Spinner } from '@/components/Spinner'
import { SidebarMenu } from '@/components/ui/sidebar'

import { PostMenuItem } from './EditorSidebar/PostMenuItem'
import TiptapEditor from './TiptapEditor'
import { TiptapDoc, useEditorContext } from './hooks/EditorProvider'

const Editor = () => {
  const { docId$, docs$, createDoc } = useEditorContext()
  const docId = use$(docId$)

  if (!docId) {
    return (
      <div className='mt-8 select-none text-eva-text/70'>
        <div className='mb-6 text-eva-text'>
          Select below or tap to{' '}
          <span
            onClick={createDoc}
            className='cursor-pointer border-b border-dashed border-b-eva-text'
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
                className='absolute ml-2 mt-2'
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
