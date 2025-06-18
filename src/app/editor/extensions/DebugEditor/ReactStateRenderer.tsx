import { EditorState } from '@tiptap/pm/state'
import { schema } from '@tiptap/pm/schema-basic'
import { Node } from '@tiptap/pm/model'
import React from 'react'

const ReactStateRendererImpl = ({ state }: { state: EditorState }) => {
  return (
    <div className='font-mono bg-slate-800 p-2 rounded-xl'>
      <div className='text-sm text-eva-text/70'>doc</div>
      <div className='flex flex-col gap-2'>
        {state.doc.children.map((node, index) => (
          <NodeRenderer key={index} node={node} />
        ))}
      </div>
    </div>
  )
}

export const ReactStateRenderer = React.memo(ReactStateRendererImpl)

export const NodeRenderer = ({ node }: { node: Node }) => {
  if (node.type.name === schema.nodes.paragraph.name) {
    return (
      <div className='bg-blue-900 rounded-xl p-2'>
        <div className='text-sm text-eva-text/70'>p</div>
        <span className='text-gray-500 text-[0.33rem]'>{'<p>'}</span>
        {node.children.map((node, index) => (
          <NodeRenderer key={index} node={node} />
        ))}
        <span className='text-gray-500 text-[0.33rem]'>{'</p>'}</span>
      </div>
    )
  }

  if (node.isText) {
    return node.text
  }

  return <div className='bg-gray-400 text-gray-50'>ukn</div>
}
