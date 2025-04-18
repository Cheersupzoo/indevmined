import { Editor } from '@tiptap/core'
import { GripVertical, PlusIcon } from 'lucide-react'
import React, { memo } from 'react'
import { findBlockNodeAt } from '../extensions/DragHandleExtension/ProseMirrorPlugin'
import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import { NodeMenu } from './NodeMenu'

const PreNodeToolsImpl = ({ editor }: { editor: Editor | null }) => {
  return (
    <div
      style={{ visibility: 'hidden' }}
      className='pre-node-tool-container absolute top-0 left-0 -translate-x-full pr-4 flex flex-row space-x-1'
    >
      <div
        onClick={(event) => {
          if (!editor) return
          const pos = editor.view.posAtCoords({
            left: event.clientX,
            top: event.clientY
          })
          if (!pos) {
            return
          }

          const nodePos = findBlockNodeAt(editor.state, pos.pos)

          if (typeof nodePos !== 'number') return
          const node = editor.$pos(nodePos + 1)

          if (!node) return

          editor.view.dom.focus()

          editor
            .chain()
            .insertContentAt(
              node.range.to,
              editor.schema.nodes.paragraph.create(null, [
                editor.schema.text('/')
              ])
            )
            .setTextSelection(nodePos + node.size + 2)
            .scrollIntoView()
            .run()
        }}
        className='text-eva-text/60 hover:text-eva-text/70 hover:bg-eva-text/10 py-1 px-1 rounded-md cursor-pointer'
      >
        <PlusIcon size={16} />
      </div>
      <div
        className='drag-handle text-eva-text/60 hover:text-eva-text/70 hover:bg-eva-text/10 py-1 px-1 rounded-md cursor-grab'
        draggable
        onClick={(event) => {
          event.preventDefault()
          if (!editor) return
          const pos = editor.view.posAtCoords({
            left: event.clientX,
            top: event.clientY
          })
          if (!pos) {
            return
          }
          editor.chain().setNodeSelection(pos.pos).run()
          const component = new ReactRenderer(NodeMenu, {
            editor,
            props: {
              editor
            }
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
            }
          })
        }}
      >
        <GripVertical size={16} />
      </div>
    </div>
  )
}

export const PreNodeTools = memo(PreNodeToolsImpl)
