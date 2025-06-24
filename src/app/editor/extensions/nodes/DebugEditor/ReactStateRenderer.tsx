import React, { useEffect } from 'react'

import { Node } from '@tiptap/pm/model'
import { schema } from '@tiptap/pm/schema-basic'
import { motion, useAnimate } from 'motion/react'

import { cn } from '@/lib/utils'

export const NodeRenderer = ({
  node,
  animate: isAnimate,
  pos = 0,
  showPos = false,
  groupClassName,
}: {
  node: Node
  animate?: boolean
  pos?: number
  showPos?: boolean
  groupClassName?: React.HTMLAttributes<HTMLDivElement>['className']
}) => {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    if (scope.current && isAnimate) {
      ;(async () => {
        await animate('.blockquote', { height: 0 }, { duration: 0 })
        await animate('.paragraph', { height: 0 }, { duration: 0 })
        requestAnimationFrame(async () => {
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
        })
      })()
    }
  }, [pos, node])

  if (node.type.name === schema.nodes.doc.name) {
    let currentPos = pos
    return (
      <div ref={scope} className='rounded-xl bg-slate-800 p-2 font-mono'>
        <div className='text-sm text-eva-text/70'>doc</div>
        <div className={cn('flex flex-col gap-2', groupClassName)}>
          {showPos && <NodePos pos={pos} />}
          {node.children.map((node, index) => {
            const startPos = currentPos
            currentPos += node.nodeSize
            return (
              <NodeRenderer
                key={index}
                node={node}
                animate={isAnimate}
                pos={startPos}
                showPos={showPos}
              />
            )
          })}
          {showPos && <NodePos pos={currentPos} />}
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
            <NodeRenderer
              key={index}
              node={node}
              animate={isAnimate}
              showPos={showPos}
            />
          ))}
        </div>
      </div>
    )
  }

  if (node.type.name === schema.nodes.paragraph.name) {
    let currentPos = pos
    return (
      <motion.div
        layout
        className='paragraph w-fit overflow-hidden rounded-xl bg-blue-900'
      >
        <motion.div layout='position' className='p-2'>
          <div className='text-sm text-eva-text/70'>p</div>
          <span className='text-[0.33rem] text-gray-500'>{'<p>'}</span>
          {node.children.map((node, index) => {
            const startPos = currentPos + 1
            currentPos += node.nodeSize
            return (
              <NodeRenderer
                key={index}
                node={node}
                animate={isAnimate}
                pos={startPos}
                showPos={showPos}
              />
            )
          })}
          <span className='text-[0.33rem] text-gray-500'>{'</p>'}</span>
        </motion.div>
      </motion.div>
    )
  }

  if (node.isText) {
    const text = node.text || ''

    if (showPos) {
      return (
        <span className=''>
          {text.split('').map((char, index) => (
            <React.Fragment key={index}>
              <NodePos pos={pos + index} />
              {char}
            </React.Fragment>
          ))}
          {showPos && <NodePos pos={pos + node.nodeSize} />}
        </span>
      )
    }
    return text
  }

  return <div className='bg-gray-400 text-gray-50'>ukn</div>
}

export const ReactStateRenderer = React.memo(NodeRenderer)

const NodePos = ({ pos }: { pos: number }) => (
  <span className='inline-block translate-y-2 text-xs text-gray-400'>
    {pos}
  </span>
)
