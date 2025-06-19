import { Editor } from '@tiptap/core'
import { SquareDashedBottomIcon } from 'lucide-react'

import { findBlockNodeAt } from '../extensions/DragHandleExtension/ProseMirrorPlugin'

export const SelectNode = ({ editor }: { editor: Editor }) => {
  return (
    <button
      onClick={() => {
        const pos = findBlockNodeAt(editor.state, editor.state.selection.from)
        if (!pos) return
        editor.chain().setNodeSelection(pos).run()
      }}
    >
      <SquareDashedBottomIcon size={16} />
    </button>
  )
}
