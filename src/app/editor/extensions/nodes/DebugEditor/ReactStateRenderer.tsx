import React from 'react'

import { Node } from '@tiptap/pm/model'
import { schema } from '@tiptap/pm/schema-basic'

export const NodeRenderer = ({ node }: { node: Node }) => {
  if (node.type.name === schema.nodes.doc.name) {
    return (
      <div className='rounded-xl bg-slate-800 p-2 font-mono'>
        <div className='text-sm text-eva-text/70'>doc</div>
        <div className='flex flex-col gap-2'>
          {node.children.map((node, index) => (
            <NodeRenderer key={index} node={node} />
          ))}
        </div>
      </div>
    )
  }
  if (node.type.name === schema.nodes.blockquote.name) {
    return (
      <div className='rounded-xl bg-emerald-700 p-2'>
        <div className='text-sm text-eva-text/70'>blockquote</div>
        {node.children.map((node, index) => (
          <NodeRenderer key={index} node={node} />
        ))}
      </div>
    )
  }

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

export const ReactStateRenderer = React.memo(NodeRenderer)
