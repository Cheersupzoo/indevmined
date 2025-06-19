import React, { memo, useRef } from 'react'

import { Editor } from '@tiptap/core'
import { ReactRenderer } from '@tiptap/react'
import { GripVertical, PlusIcon } from 'lucide-react'
import tippy from 'tippy.js'

import { findBlockNodeAt } from '../extensions/functionality/DragHandleExtension/ProseMirrorPlugin'
import { NodeMenu } from './NodeMenu'

const PreNodeToolsImpl = ({ editor }: { editor: Editor | null }) => {
  const container = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={container}
      style={{ visibility: 'hidden' }}
      className='pre-node-tool-container absolute left-0 top-0 flex -translate-x-full flex-row space-x-1 pr-4'
    >
      <div
        onClick={(event) => {
          if (!editor) return
          const pos = editor.view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          })
          if (!pos) {
            return
          }

          const nodePos = findBlockNodeAt(editor.state, pos.pos)

          if (typeof nodePos !== 'number') return
          const node = editor.state.doc.nodeAt(nodePos)
          if (!node) return

          editor.view.dom.focus()

          editor
            .chain()
            .insertContentAt(
              nodePos + node.nodeSize,
              editor.schema.nodes.paragraph.create(null, [
                editor.schema.text('/'),
              ])
            )
            .setTextSelection(nodePos + node.nodeSize + 2)
            .scrollIntoView()
            .run()
        }}
        className='cursor-pointer rounded-md px-1 py-1 text-eva-text/60 hover:bg-eva-text/10 hover:text-eva-text/70'
      >
        <PlusIcon size={16} />
      </div>
      <div
        className='drag-handle cursor-grab rounded-md px-1 py-1 text-eva-text/60 hover:bg-eva-text/10 hover:text-eva-text/70'
        draggable
        onClick={(event) => {
          event.preventDefault()
          if (!editor || container.current?.dataset.pos === undefined) return
          const pos = parseInt(container.current.dataset.pos)
          editor.chain().setNodeSelection(pos).run()
          const component = new ReactRenderer(NodeMenu, {
            editor,
            props: {
              editor,
            },
          })
          const popup = tippy(event.currentTarget, {
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'left',
            arrow: false,
            onCreate: () => {
              editor.view.dom.style.pointerEvents = 'none'
            },
            onHide: () => {
              editor.view.dom.style.pointerEvents = ''
            },
          })
        }}
      >
        <GripVertical size={16} />
      </div>
    </div>
  )
}

export const PreNodeTools = memo(PreNodeToolsImpl)
