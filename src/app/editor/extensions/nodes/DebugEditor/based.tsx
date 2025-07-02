import { Node, NodeViewProps } from '@tiptap/core'

import { TypeRenderer } from './TypeRenderer'

const name = 'debugEditor'
const ReactNode = (props: NodeViewProps) => {
  return (
    <div className='relative -mx-3 rounded-xl border border-eva-text-border px-5 py-3'>
      <TypeRenderer type={props.node.attrs.type} />
    </div>
  )
}

export const DebugEditorBased = Node.create({
  name,
  addAttributes() {
    return {
      type: {
        default: 1,
      },
    }
  },
  reactNode: ReactNode,
})
