'use client'

import dynamic from 'next/dynamic'
import React, { useState } from 'react'

import type {
  NonDeletedExcalidrawElement,
  Ordered,
} from '@excalidraw/excalidraw/element/types'
import '@excalidraw/excalidraw/index.css'
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { Edit2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import './OverrideTheme.css'

const ExcalidrawCanvas = dynamic(
  async () => (await import('./ExcalidrawCanvas')).default,
  {
    ssr: false,
    loading: () => {
      console.log('excalidraw')

      return <div>Loading</div>
    },
  }
)

export const ExcalidrawComponent = (props: NodeViewProps) => {
  return (
    <NodeViewWrapper>
      <div
        data-drag-handle
        className='relative flex h-56 items-center justify-center'
      >
        <ExcalidrawDialog {...props} />
        {props.node.attrs.svg && (
          <div
            className='h-full'
            dangerouslySetInnerHTML={{ __html: props.node.attrs.svg }}
          />
        )}
      </div>
    </NodeViewWrapper>
  )
}

export const ExcalidrawDialog = (props: NodeViewProps) => {
  const [open, setOpen] = useState(false)
  const onSave = (update: {
    state: readonly Ordered<NonDeletedExcalidrawElement>[]
    svg: any
  }) => {
    props.updateAttributes(update)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {!props.node.attrs.state ? (
          <Button variant='outline'>Open Excalidraw Canvas</Button>
        ) : (
          <div className='absolute right-2 top-2 cursor-pointer rounded-md border border-eva-text-border p-1.5 hover:bg-eva-text-border'>
            <Edit2Icon size={16} />
          </div>
        )}
      </DialogTrigger>
      <DialogContent className='h-full max-h-[500px] grid-rows-[auto_minmax(0,_1fr)_auto] px-0 sm:max-w-[700px]'>
        <DialogHeader className='px-6'>
          <DialogTitle className='text-eva-text'>Excalidraw</DialogTitle>
        </DialogHeader>
        <ExcalidrawCanvas
          initialElements={props.node.attrs.state}
          onSave={onSave}
        />
      </DialogContent>
    </Dialog>
  )
}
