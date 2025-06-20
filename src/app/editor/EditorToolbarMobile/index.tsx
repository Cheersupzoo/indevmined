import React, { useEffect, useRef, useState } from 'react'

import { debounce } from '@/utils/debounce'
import { Editor } from '@tiptap/core'

import { DeleteNode } from './DeleteNode'
import { DuplicateNode } from './DuplicateNode'
import { InsertComponentDrawer } from './InsertComponentDrawer'
import { InsertImage } from './InsertImage'
import { IsParagraph } from './IsParagraph'
import { NodeDown } from './NodeDown'
import { NodeUp } from './NodeUp'
import { SelectNode } from './SelectNode'
import { ToolbarVerticalDivider } from './ToolbarVerticalDivider'
import { UndoRedo } from './UndoRedo'
import { IsCodeBlock } from './isCode'

export const EditorToolbarMobile = ({ editor }: { editor: Editor }) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [isEditable, setIsEditable] = useState(editor.isEditable)

  useEffect(() => {
    const update = ({ editor }: { editor: Editor }) => {
      setIsEditable(editor.isEditable)
    }
    editor.on('update', update)
    return () => {
      editor.off('update', update)
    }
  }, [editor])

  useEffect(() => {
    function resizeHandler() {
      if (!isEditable || !divRef.current || !window.visualViewport) {
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
  }, [isEditable])

  if (!isEditable) {
    return <></>
  }

  return (
    <div
      ref={divRef}
      className='fixed left-0 right-0 top-0 mx-4 flex h-10 touch-manipulation select-none items-center overflow-x-auto overflow-y-hidden rounded-lg border border-eva-text-border bg-background [&>button]:p-3'
      style={{ transform: 'translateY(calc(100vh - 100% - 4px))' }}
    >
      <SelectNode editor={editor} />
      <ToolbarVerticalDivider />
      <UndoRedo editor={editor} />
      <ToolbarVerticalDivider />
      <IsParagraph editor={editor} />
      <IsCodeBlock editor={editor} />
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
