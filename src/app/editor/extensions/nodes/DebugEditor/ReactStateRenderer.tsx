import React, { useEffect } from 'react'

import { Node } from '@tiptap/pm/model'
import { schema } from '@tiptap/pm/schema-basic'
import { useAnimate } from 'motion/react'

export const NodeRenderer = ({
  node,
  animate: isAnimate,
  pos = 0,
}: {
  node: Node
  animate?: boolean
  pos?: number
}) => {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    if (scope.current && isAnimate) {
      ;(async () => {
        await animate('.blockquote', { height: 0 }, { duration: 0.001 })
        await animate('.paragraph', { height: 0 }, { duration: 0.001 })
        await animate(
          '.paragraph',
          { height: 'auto' },
          { duration: 0.5, delay: 0.1, ease: 'easeOut' }
        )
        await animate(
          '.blockquote',
          { height: 'auto' },
          { duration: 0.5, delay: 0.1, ease: 'easeOut' }
        )
      })()
    }
  }, [pos, node])

  if (node.type.name === schema.nodes.doc.name) {
    let currentPos = pos
    return (
      <div ref={scope} className='rounded-xl bg-slate-800 p-2 font-mono'>
        <div className='text-sm text-eva-text/70'>doc</div>
        <div className='flex flex-col gap-2'>
          {node.children.map((node, index) => {
            const startPos = currentPos + 1
            currentPos += node.nodeSize
            return (
              <NodeRenderer
                key={index}
                node={node}
                animate={isAnimate}
                pos={startPos}
              />
            )
          })}
        </div>
      </div>
    )
  }
  if (node.type.name === schema.nodes.blockquote.name) {
    return (
      <div className='blockquote overflow-hidden rounded-xl bg-emerald-700'>
        <div className='p-2'>
          <div className='text-sm text-eva-text/70'>blockquote</div>
          {node.children.map((node, index) => (
            <NodeRenderer key={index} node={node} animate={isAnimate} />
          ))}
        </div>
      </div>
    )
  }

  if (node.type.name === schema.nodes.paragraph.name) {
    return (
      <div className='paragraph w-fit overflow-hidden rounded-xl bg-blue-900'>
        <div className='p-2'>
          <div className='text-sm text-eva-text/70'>p</div>
          <span className='text-[0.33rem] text-gray-500'>{'<p>'}</span>
          {node.children.map((node, index) => (
            <NodeRenderer key={index} node={node} animate={isAnimate} />
          ))}
          <span className='text-[0.33rem] text-gray-500'>{'</p>'}</span>
        </div>
      </div>
    )
  }

  if (node.isText) {
    return node.text
  }

  return <div className='bg-gray-400 text-gray-50'>ukn</div>
}

export const ReactStateRenderer = React.memo(NodeRenderer)
