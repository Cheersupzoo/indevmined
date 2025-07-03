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
      <div className='mt-4'>Initial Doc</div>
      <div className='relative font-mono'>
        <div className='grid grid-cols-2 gap-2'>
          <ReactStateRenderer node={editorStateRef.current.doc} />
          <ReactStateRenderer node={blockquote} />
        </div>
        <LineCursor pos={pos} setPos={setPos} />
      </div>
      <div className='mt-4'>Transactions to apply</div>
      <div className='rounded bg-zinc-800 [&>div>pre>div]:text-[0.8rem] [&>div>pre>div]:leading-relaxed [&>div>pre]:mb-0'>
        <CodeSync
          codeblock={{
            lang: 'js',
            meta: '',
            value: `const resolvePos = tr.selection.$from // or use \`tr.doc.resolve(pos)\` if you have pos
const finalPos = resolvePos.parent.isTextblock ? resolvePos.after() : pos // or might check \`resolvePos.parent.type.name === 'paragraph'\` depend on how would you wish to define your logic
// !bg[37] white
// !bg[16:25] lime
// !mark
tr.insert(pos, blockquote) // pos = ${pos}`,
          }}
        />
      </div>
      <Button
        onClick={() => {
          setAppliedState(
            editorStateRef.current.apply(
              editorStateRef.current.tr.insert(finalPos, blockquote)
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
