import { useRef, useState } from 'react'

import { schema } from '@tiptap/pm/schema-basic'
import { EditorState } from '@tiptap/pm/state'

import { LineCursor } from './LineCursor'
import { ReactStateRenderer } from './ReactStateRenderer'

export const Type1 = () => {
  const editorStateRef = useRef<EditorState>(
    EditorState.create({
      schema,
      doc: schema.nodes.doc.create(null, [
        schema.nodes.paragraph.create(null, [schema.text('hello')]),
      ]),
      plugins: [
        // new Plugin({
        //   key: new PluginKey('positionDecoration'),
        //   state: {
        //     init: (config, state) => {
        //       const decorations = []
        //       const total = state.doc.nodeSize
        //       for (let i = 0; i < total; i++) {
        //         const decoration = Decoration.widget(i, () => {
        //           const div = document.createElement('div')
        //           div.textContent = i.toString()
        //           div.className = 'position-decoration'
        //           return div
        //         })
        //         decorations.push(decoration)
        //       }
        //       return DecorationSet.create(state.doc, decorations)
        //     },
        //     apply: (tr, decorationSet) => {
        //       const decorations = []
        //       const total = tr.doc.nodeSize
        //       for (let i = 0; i < total; i++) {
        //         const decoration = Decoration.widget(i, () => {
        //           const div = document.createElement('div')
        //           div.textContent = i.toString()
        //           div.className = 'position-decoration'
        //           return div
        //         })
        //         decorations.push(decoration)
        //       }
        //       return DecorationSet.create(tr.doc, decorations)
        //     }
        //   },
        //   props: {
        //     decorations(state) {
        //       return this.getState(state)
        //     }
        //   }
        // })
      ],
    })
  )

  const [appliedState, setAppliedState] = useState<EditorState | null>(null)
  const [pos, setPos] = useState(1)

  return (
    <>
      {' '}
      <div className='absolute right-2 top-0 rounded-b-xl border-x-2 border-b-2 border-dashed border-eva-text px-1'>
        Insert Text at position
      </div>
      <div className='mt-4'>Initial Doc</div>
      <div className='relative font-mono'>
        <ReactStateRenderer node={editorStateRef.current.doc} />
        <LineCursor pos={pos} setPos={setPos} />
      </div>
      <div className='mt-4'>Transactions to apply</div>
      <div className='bg-gray-600/70 px-1 font-mono text-sm'>
        tr.insertText('world', pos) // pos ={' '}
        <span className='bg-yellow-200 text-yellow-800'>{pos}</span>
      </div>
      <button
        onClick={() => {
          setAppliedState(
            editorStateRef.current.apply(
              editorStateRef.current.tr.insertText('world', pos)
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
          <ReactStateRenderer node={appliedState.doc} />
        </div>
      )}
    </>
  )
}
