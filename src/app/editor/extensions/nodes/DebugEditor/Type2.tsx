'use client'

import { useRef, useState } from 'react'

import { schema } from '@tiptap/pm/schema-basic'
import { EditorState } from '@tiptap/pm/state'

import { Button } from '@/components/ui/button'

import { CodeSync } from '../Code/Component'
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
      <div className='rounded bg-zinc-800 [&>div>pre]:mb-0'>
        <CodeSync
          codeblock={{
            lang: 'js',
            meta: '',
            value: `// !bg[37] white
// !bg[16:25] lime
tr.insert(pos, blockquote) // pos = ${pos}`,
          }}
          line={false}
        />
      </div>
      <Button
        onClick={() => {
          setAppliedState(
            editorStateRef.current.apply(
              editorStateRef.current.tr.insert(pos, blockquote)
            )
          )
        }}
        variant='default'
        className='mt-2'
      >
        Apply
      </Button>
      {appliedState && (
        <div className='mt-4'>
          <div>Final Doc</div>
          <ReactStateRenderer animate node={appliedState.doc} />
        </div>
      )}
    </>
  )
}
