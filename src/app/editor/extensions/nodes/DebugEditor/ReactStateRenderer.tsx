import React from 'react'

import { Node } from '@tiptap/pm/model'
import { schema } from '@tiptap/pm/schema-basic'
import { EditorState } from '@tiptap/pm/state'

const ReactStateRendererImpl = ({ state }: { state: EditorState }) => {
  return (
    <div className='rounded-xl bg-slate-800 p-2 font-mono'>
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
      <div className='rounded-xl bg-blue-900 p-2'>
        <div className='text-sm text-eva-text/70'>p</div>
        <span className='text-[0.33rem] text-gray-500'>{'<p>'}</span>
        {node.children.map((node, index) => (
          <NodeRenderer key={index} node={node} />
        ))}
        <span className='text-[0.33rem] text-gray-500'>{'</p>'}</span>
      </div>
    )
  }

  if (node.isText) {
    return node.text
  }

  return <div className='bg-gray-400 text-gray-50'>ukn</div>
}
