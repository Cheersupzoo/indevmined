import { Node, NodeViewProps } from '@tiptap/core'

const ReactNode = (props: NodeViewProps) => {
  return (
    <div className='relative flex h-56 items-center justify-center'>
      {props.node.attrs.svg && (
        <div
          className='h-full'
          dangerouslySetInnerHTML={{ __html: props.node.attrs.svg }}
        />
      )}
    </div>
  )
}

export const ExcalidrawNodeBased = Node.create({
  name: 'ExcalidrawBlock',
  addAttributes() {
    return {
      state: {
        default: null,
      },
      svg: {
        default: null,
      },
    }
  },
  reactNode: ReactNode,
})
