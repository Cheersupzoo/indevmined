import { EditorState, Plugin, PluginKey } from '@tiptap/pm/state'
import { NodeViewWrapper } from '@tiptap/react'
import { schema } from '@tiptap/pm/schema-basic'
import React, { useRef, useState } from 'react'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { ReactStateRenderer } from './ReactStateRenderer'

export const DebugEditorComponent = () => {
  const editorStateRef = useRef<EditorState>(
    EditorState.create({
      schema,
      doc: schema.nodes.doc.create(null, [
        schema.nodes.paragraph.create(null, [schema.text('hello')])
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
      ]
    })
  )

  const [appliedState, setAppliedState] = useState<EditorState | null>(null)
  const [pos, setPos] = useState(1)

  const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const parent = e.currentTarget.parentElement
    if (!parent) return
    const parentParent = parent.parentElement
    if (!parentParent) return
    const startLeft = parentParent.getBoundingClientRect().left
    const width = parentParent.offsetWidth
    if (!startLeft || !width) return

    const getPos = (pageX: number) => {
      const left = pageX - startLeft
      const pos = Math.round(Math.max(0, Math.min(left / (width / 7), 7)))
      return pos
    }
    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      const pos =
        e instanceof MouseEvent ? getPos(e.pageX) : getPos(e.touches[0].pageX)
      setPos(pos)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('touchmove', onMouseMove, { passive: false })
    const clear = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('touchmove', onMouseMove)
      document.removeEventListener('mouseup', clear)
      document.removeEventListener('touchend', clear)
      document.removeEventListener('blur', clear)
    }
    document.addEventListener('mouseup', clear)
    document.addEventListener('touchend', clear)
    document.addEventListener('blur', clear)
  }

  return (
    <NodeViewWrapper>
      <div className='relative border-2 border-dashed border-eva-text rounded-xl p-2 '>
        <div className='absolute top-0 right-2 border-b-2 border-x-2 border-dashed border-eva-text rounded-b-xl px-1'>
          Demo Insert Text at position
        </div>
        <div className='mt-4'>Initial Doc</div>
        <div className='relative font-mono'>
          <ReactStateRenderer state={editorStateRef.current} />
          <div
            className='absolute bottom-2 '
            style={{
              left: `1rem`,
              width: '7ch'
            }}
          >
            <div className='relative' style={{ left: `${pos}ch` }}>
              <div
                onTouchStart={onMouseDown}
                onMouseDown={onMouseDown}
                className='bg-yellow-200 triangle-text-clip w-4 h-8 absolute -translate-x-1/2 -bottom-4 touch-none text-yellow-800 flex justify-center items-end'
              >
                <div className='-m-[6px]'>{pos}</div>
              </div>
              <div
                onTouchStart={onMouseDown}
                onMouseDown={onMouseDown}
                className='text-yellow-200 w-[1px] h-6 absolute bottom-4 -translate-x-1/2 animate-blinking'
              />
            </div>
          </div>
        </div>
        <div className='mt-4'>Transactions to apply</div>
        <div className='font-mono text-sm bg-gray-600/70 px-1'>
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
          className='bg-orange-600 px-2 py-1 rounded-md hover:bg-orange-700 mt-2'
        >
          Apply
        </button>
        {appliedState && (
          <div className='mt-4'>
            <div>Final Doc</div>
            <ReactStateRenderer state={appliedState} />
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}
