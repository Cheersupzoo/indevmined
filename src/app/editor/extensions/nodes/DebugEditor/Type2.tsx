'use client'

import { useRef, useState } from 'react'

import { schema } from '@tiptap/pm/schema-basic'
import { EditorState } from '@tiptap/pm/state'

import { LineCursor } from './LineCursor'
import { ReactStateRenderer } from './ReactStateRenderer'

const blockquote = schema.nodes.blockquote.create(null, [
  schema.nodes.paragraph.create(null, [schema.text('this is blockquote')]),
])

export const Type2 = () => {
  const editorStateRef = useRef<EditorState>(
    EditorState.create({
      schema,
      doc: schema.nodes.doc.create(null, [
        schema.nodes.paragraph.create(null, [schema.text('hello')]),
      ]),
    })
  )

  const [appliedState, setAppliedState] = useState<EditorState | null>(null)
  const [pos, setPos] = useState(1)

  return (
    <>
      <div className=''>Initial Doc</div>
      <div className='relative font-mono'>
        <div className='grid grid-cols-2 gap-2'>
          <ReactStateRenderer node={editorStateRef.current.doc} />
          <ReactStateRenderer node={blockquote} />
        </div>
        <LineCursor pos={pos} setPos={setPos} />
      </div>
      <div className='mt-4'>Transactions to apply</div>
      <div className='bg-gray-600/70 px-1 font-mono text-sm'>
        tr.insert(pos, <span className='text-emerald-500'>blockquote</span>) //
        pos = <span className='bg-yellow-200 text-yellow-800'>{pos}</span>
      </div>
      <button
        onClick={() => {
          setAppliedState(
            editorStateRef.current.apply(
              editorStateRef.current.tr.insert(pos, blockquote)
            )
          )
        }}
        className='mt-2 rounded-md bg-orange-600 px-2 py-1 hover:bg-orange-700'
      >
        Apply
      </button>
      {appliedState && (
        <div className='mt-4'>
          <div>Final Doc</div>
          <ReactStateRenderer animate node={appliedState.doc} />
        </div>
      )}
    </>
  )
}
