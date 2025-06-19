import { ForwardRefExoticComponent, RefAttributes } from 'react'

import { Editor } from '@tiptap/core'
import {
  CopyIcon,
  LucideProps,
  RemoveFormattingIcon,
  Trash2Icon,
} from 'lucide-react'
import { hideAll } from 'tippy.js'

const nodeMenuActions: {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
  title: string
  shortcut?: string
  command: (editor: Editor) => void
}[] = [
  {
    title: 'Delete',
    icon: Trash2Icon,
    command: (editor) => {
      editor.chain().deleteSelection().hideDragHandle().run()
      hideAll()
    },
    shortcut: 'Del',
  },
  {
    title: 'Duplicate',
    icon: CopyIcon,
    command: (editor) => {
      const currentNode = editor.state.doc.nodeAt(editor.state.selection.from)

      editor
        .chain()
        .insertContentAt(editor.state.selection.to, currentNode)
        .hideDragHandle()
        .run()

      hideAll()
    },
  },
  {
    title: 'Clear Formatting',
    icon: RemoveFormattingIcon,
    command: (editor) => {
      editor.chain().focus().unsetAllMarks().run()
      hideAll()
    },
  },
]

export const NodeMenu = ({
  editor,
}: React.PropsWithoutRef<{ editor: Editor }>) => {
  return (
    <div className='min-w-48 rounded-xl border border-zinc-700 bg-zinc-800 px-1 py-2 shadow-xl'>
      <div className='px-1 py-1'>
        {nodeMenuActions.map((action) => (
          <div
            onClick={() => action.command(editor)}
            key={action.title}
            className='cmdk-item hover:bg-text/10'
          >
            <action.icon className='h-4 w-4 text-eva-text/50' />
            <p>{action.title}</p>
            <div className='ml-auto text-eva-text/50'>{action.shortcut}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
