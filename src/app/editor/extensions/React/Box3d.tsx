'use client'

import { ComponentType, useRef } from 'react'

import { Node, NodeViewProps, mergeAttributes } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { useAnimationFrame } from 'motion/react'

export const Box3d = () => {
  const ref = useRef<HTMLDivElement>(null)

  useAnimationFrame((t) => {
    if (!ref.current) return

    const rotate = Math.sin(t / 10000) * 200
    const y = (1 + Math.sin(t / 1000)) * -50
    ref.current.style.transform = `translateY(${y}px) rotateX(${rotate}deg) rotateY(${rotate}deg)`
  })

  return (
    <div className='container'>
      <div className='cube' ref={ref}>
        <div className='side front' />
        <div className='side left' />
        <div className='side right' />
        <div className='side top' />
        <div className='side bottom' />
        <div className='side back' />
      </div>
      <StyleSheet />
    </div>
  )
}

function StyleSheet() {
  return (
    <style>{`
      .container {
          perspective: 800px;
          width: 100px;
          height: 200px;
          margin: 0 auto;
          padding-top: 100px;
      }

      .cube {
          width: 100px;
          height: 100px;
          position: relative;
          transform-style: preserve-3d;
          --hue-0-transparent: #fff31244;
          --hue-1-transparent: #ff008844;
          --hue-2-transparent: #dd00ee44;
          --hue-3-transparent: #9911ff44;
          --hue-4-transparent: #0d63f844;
          --hue-5-transparent: #0cdcf744;
          --hue-6-transparent: #8df0cc44;
      }

      .side {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: red;
          opacity: 0.6;
      }

      .front {
          transform: rotateY(0deg) translateZ(50px);
          background-color: var(--hue-1-transparent);
      }
      .right {
          transform: rotateY(90deg) translateZ(50px);
          background-color: var(--hue-2-transparent);
      }
      .back {
          transform: rotateY(180deg) translateZ(50px);
          background-color: var(--hue-3-transparent);
      }
      .left {
          transform: rotateY(-90deg) translateZ(50px);
          background-color: var(--hue-4-transparent);
      }
      .top {
          transform: rotateX(90deg) translateZ(50px);
          background-color: var(--hue-5-transparent);
      }
      .bottom {
          transform: rotateX(-90deg) translateZ(50px);
          background-color: var(--hue-6-transparent);
      }

  `}</style>
  )
}

const createReactNode = (name: string, Component: () => React.ReactElement) =>
  Node.create({
    name: name,
    group: 'block',
    draggable: true,
    content: '',
    atom: true,

    parseHTML() {
      return [
        {
          tag: this.name,
        },
      ]
    },

    renderHTML({ HTMLAttributes }) {
      return [this.name, mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
      return ReactNodeViewRenderer(() => (
        <NodeViewWrapper>
          <Component />
        </NodeViewWrapper>
      ))
    },
  })

export const Box3dNode = createReactNode('react-component-box3d', Box3d)
