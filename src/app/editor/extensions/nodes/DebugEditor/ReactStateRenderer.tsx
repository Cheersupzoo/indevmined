import React, { useEffect, useMemo } from 'react'

import { Fragment, Node } from '@tiptap/pm/model'
import { schema } from '@tiptap/pm/schema-basic'
import { motion, useAnimate } from 'motion/react'

import { cn } from '@/lib/utils'

export const NodeRenderer = ({
  node,
  animate: isAnimate,
  pos = 0,
  showPos = false,
  groupClassName,
  decorationsMap,
}: {
  node: Node | Fragment
  animate?: boolean
  pos?: number
  showPos?: boolean
  groupClassName?: React.HTMLAttributes<HTMLDivElement>['className']
  decorationsMap?: Map<number, React.ReactNode[]>
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

  if (node instanceof Fragment) {
    return node.content.map((node, index) => (
      <NodeRenderer
        key={index}
        node={node}
        animate={isAnimate}
        pos={pos}
        showPos={showPos}
        decorationsMap={decorationsMap}
      />
    ))
  }

  if (node.type.name === schema.nodes.doc.name) {
    let currentPos = pos
    return (
      <div ref={scope} className='rounded-xl bg-slate-800 p-2 font-mono'>
        <div className='text-sm text-eva-text/70'>doc</div>
        <div className={cn('flex flex-col gap-2', groupClassName)}>
          {node.children.map((node, index) => {
            const startPos = currentPos
            currentPos += node.nodeSize

            return (
              <React.Fragment key={index}>
                <span>
                  {showPos && <NodePos pos={startPos} />}
                  {decorationsMap
                    ?.get(startPos)
                    ?.map((decoration, index) => (
                      <React.Fragment key={index}>{decoration}</React.Fragment>
                    ))}
                </span>
                <NodeRenderer
                  node={node}
                  animate={isAnimate}
                  pos={startPos}
                  showPos={showPos}
                  decorationsMap={decorationsMap}
                />
              </React.Fragment>
            )
          })}
          <span>
            {showPos && <NodePos pos={currentPos} />}
            {decorationsMap
              ?.get(currentPos)
              ?.map((decoration, index) => (
                <React.Fragment key={index}>{decoration}</React.Fragment>
              ))}
            {[
              ...(decorationsMap
                ?.entries()
                .filter(([pos]) => pos > currentPos)
                .map(([pos, elements]) => {
                  console.log(pos, elements)
                  return (
                    <React.Fragment key={pos}>
                      {elements.map((element, index) => (
                        <React.Fragment key={index}>{element}</React.Fragment>
                      ))}
                    </React.Fragment>
                  )
                }) ?? []),
            ]}
          </span>
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
              decorationsMap={decorationsMap}
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
                decorationsMap={decorationsMap}
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

    return (
      <span className=''>
        {text.split('').map((char, index) => (
          <React.Fragment key={index}>
            {showPos && <NodePos pos={pos + index} />}
            {decorationsMap
              ?.get(pos + index)
              ?.map((decoration, index) => (
                <React.Fragment key={index}>{decoration}</React.Fragment>
              ))}
            {char}
          </React.Fragment>
        ))}
        {showPos && <NodePos pos={pos + node.nodeSize} />}
        {decorationsMap
          ?.get(pos + node.nodeSize)
          ?.map((decoration, index) => (
            <React.Fragment key={index}>{decoration}</React.Fragment>
          ))}
      </span>
    )
  }

  return <div className='bg-gray-400 text-gray-50'>ukn</div>
}

export const ReactStateRenderer = React.memo(NodeRenderer)

const NodePos = ({ pos }: { pos: number }) => (
  <span className='inline-block translate-y-2 text-xs text-color3'>{pos}</span>
)
