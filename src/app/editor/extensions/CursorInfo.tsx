import { Editor } from '@tiptap/core'
import { Transaction } from '@tiptap/pm/state'
import { useObservable, Memo } from '@legendapp/state/react'
import React, { useEffect } from 'react'

export const CursorInfo = ({ editor }: { editor: Editor }) => {
  const position$ = useObservable({ from: 0, to: 0, sharedDepth: 0 })
  useEffect(() => {
    const fn = ({ editor }: { editor: Editor; transaction: Transaction }) => {
      position$.set({
        from: editor.view.state.selection.from,
        to: editor.view.state.selection.to,
        sharedDepth: editor.view.state.selection.$from.sharedDepth(
          editor.view.state.selection.to
        )
      })
    }
    editor.on('transaction', fn)

    return () => {
      editor.off('transaction', fn)
    }
  }, [editor])

  return (
    <div className='fixed top-20 right-0 text-slate-200 bg-slate-900'>
      <div>
        From <Memo>{position$.from}</Memo> To <Memo>{position$.to}</Memo>
      </div>
      <div>SharedDepth <Memo>{position$.sharedDepth}</Memo></div>
    </div>
  )
}
