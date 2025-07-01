'use client'

import { useRef, useState } from 'react'

import { schema } from '@tiptap/pm/schema-basic'
import { EditorState } from '@tiptap/pm/state'

import { LineCursor } from './LineCursor'
import { ReactStateRenderer } from './ReactStateRenderer'

const blockquote = schema.nodes.blockquote.create(null, [
  schema.nodes.paragraph.create(null, [schema.text('this is blockquote')]),
])

export const Type3 = () => {
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

  const resPos = editorStateRef.current.doc.resolve(pos)
  const parent = resPos.parent
  const finalPos = parent.isTextblock ? resPos.after() : pos

  return (
    <>
      {' '}
      <div className='absolute right-2 top-0 rounded-b-xl border-x-2 border-b-2 border-dashed border-eva-text px-1'>
        Insert Node at position v2
      </div>
      <div className='mt-4'>Initial Doc</div>
      <div className='relative font-mono'>
        <div className='grid grid-cols-2 gap-2'>
          <ReactStateRenderer node={editorStateRef.current.doc} />
          <ReactStateRenderer node={blockquote} />
        </div>
        <LineCursor pos={pos} setPos={setPos} />
      </div>
      <div className='mt-4'>Transactions to apply</div>
      <div className='flex flex-col overflow-x-auto text-nowrap bg-gray-600/70'>
        <div className='px-1 font-mono text-sm'>
          const resolvePos = tr.selection.$from // or use `tr.doc.resolve(pos)`
          if you have pos
        </div>
        <div className='px-1 font-mono text-sm'>
          const finalPos = resolvePos.parent.isTextblock ? resolvePos.after() :
          pos // or might check `resolvePos.parent.type.name === 'paragraph'`
          depend on how would you wish to define your logic
        </div>
        <div className='px-1 font-mono text-sm'>
          tr.insert(finalPos,{' '}
          <span className='text-emerald-500'>blockquote</span>) // finalPos ={' '}
          <span className='bg-yellow-200 text-yellow-800'>{finalPos}</span>
        </div>
      </div>
      <button
        onClick={() => {
          setAppliedState(
            editorStateRef.current.apply(
              editorStateRef.current.tr.insert(finalPos, blockquote)
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
