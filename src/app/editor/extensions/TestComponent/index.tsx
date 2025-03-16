import { NodeViewContent, NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import React from 'react'

const index = (props: NodeViewProps) => {
  const increase = () => {
    props.updateAttributes({
      count: props.node.attrs.count + 1
    })
  }

  return (
    <NodeViewWrapper className='bg-purple-100  border-2 border-solid border-purple-500 rounded-md relative'>
      <label
        data-drag-handle
        contentEditable={false}
        className='bg-purple-500 text-white rounded-br-md font-medium px-1 py-0.5 absolute top-0'
      >
        React Component
      </label>

      <NodeViewContent className='content is-editable text-gray-800 border-2 border-dashed border-gray-400 rounded-xl mt-10 mb-4 mx-4 p-2' />
      <button contentEditable={false} onClick={increase} className='mx-4 mb-4 bg-slate-800 px-1 rounded'>
        This button has been clicked {props.node.attrs.count} times.
      </button>
    </NodeViewWrapper>
  )
}

export default index
