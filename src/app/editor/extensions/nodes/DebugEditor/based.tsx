import { Node, NodeViewProps } from '@tiptap/core'

import { TypeRenderer } from './TypeRenderer'

const name = 'debugEditor'
const ReactNode = (props: NodeViewProps) => {
  return (
    <div className='relative rounded-xl border-2 border-dashed border-eva-text p-2'>
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
