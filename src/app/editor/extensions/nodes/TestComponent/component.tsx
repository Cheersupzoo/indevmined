'use client'

import React from 'react'

import {
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from '@tiptap/react'

const index = (props: React.PropsWithChildren<NodeViewProps>) => {
  const increase = () => {
    props.updateAttributes({
      count: props.node.attrs.count + 1,
    })
  }

  const Container = props.editor ? NodeViewWrapper : 'div'

  return (
    <Container className='relative rounded-md border-2 border-solid border-purple-500 bg-purple-100'>
      <label
        data-drag-handle
        contentEditable={false}
        className='absolute top-0 rounded-br-md bg-purple-500 px-1 py-0.5 font-medium text-white'
      >
        React Component
      </label>

      {props.editor ? (
        <NodeViewContent className='content is-editable mx-4 mb-4 mt-10 rounded-xl border-2 border-dashed border-gray-400 p-2 text-gray-800' />
      ) : (
        <div className='content is-editable mx-4 mb-4 mt-10 rounded-xl border-2 border-dashed border-gray-400 p-2 text-gray-800'>
          {props.children}
        </div>
      )}
      <button
        contentEditable={false}
        onClick={increase}
        className='mx-4 mb-4 rounded bg-slate-800 px-1'
      >
        This button has been clicked {props.node.attrs.count} times.
      </button>
    </Container>
  )
}

export default index

export const TestComponentRenderer = ReactNodeViewRenderer(index)
