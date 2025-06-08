import { debounce } from '@/utils/debounce'
import React, { useEffect, useRef } from 'react'
import { InsertComponentDrawer } from './InsertComponentDrawer'
import { Editor } from '@tiptap/core'
import { InsertImage } from './InsertImage'
import { ToolbarVerticalDivider } from './ToolbarVerticalDivider'
import { DeleteNode } from './DeleteNode'
import { DuplicateNode } from './DuplicateNode'
import { NodeUp } from './NodeUp'
import { NodeDown } from './NodeDown'
import { UndoRedo } from './UndoRedo'
import { IsParagraph } from './IsParagraph'

export const EditorToolbarMobile = ({ editor }: { editor: Editor }) => {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function resizeHandler() {
      if (!divRef.current || !window.visualViewport) {
        return
      }
      // viewport height
      const offsetTop =
        (window.visualViewport.height ?? 0) -
        (divRef.current.getBoundingClientRect().height ?? 0) +
        (window.visualViewport.offsetTop ?? 0)

      divRef.current.style.transform = `translateY(${offsetTop - 4}px)`
    }

    const debouncedResizeHandler = debounce(() => resizeHandler(), 10)

    // run first time to initialize
    debouncedResizeHandler()

    // subscribe to events which affect scroll, or viewport position
    window.visualViewport?.addEventListener('resize', debouncedResizeHandler)
    window.visualViewport?.addEventListener('scroll', debouncedResizeHandler)

    // unsubscribe
    return () => {
      window.visualViewport?.removeEventListener(
        'resize',
        debouncedResizeHandler
      )
      window.visualViewport?.removeEventListener(
        'scroll',
        debouncedResizeHandler
      )
    }
  }, [])

  return (
    <div
      ref={divRef}
      className='touch-manipulation [&>button]:p-3 select-none fixed mx-4 rounded-lg left-0 right-0 top-0 h-10 border border-eva-text-border flex items-center bg-background overflow-x-auto overflow-y-hidden'
      style={{ transform: 'translateY(calc(100vh - 100% - 4px))' }}
    >
      <UndoRedo editor={editor} />
      <ToolbarVerticalDivider />
      <IsParagraph editor={editor} />
      <InsertComponentDrawer editor={editor} />
      <ToolbarVerticalDivider />
      <InsertImage />
      <ToolbarVerticalDivider />
      <DuplicateNode />
      <ToolbarVerticalDivider />
      <NodeUp />
      <NodeDown />
      <ToolbarVerticalDivider />
      <DeleteNode />
      
    </div>
  )
}
