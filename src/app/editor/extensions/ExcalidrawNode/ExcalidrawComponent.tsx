'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import '@excalidraw/excalidraw/index.css'
import './OverrideTheme.css'
import { Edit2Icon } from 'lucide-react'
import type {
  NonDeletedExcalidrawElement,
  Ordered
} from '@excalidraw/excalidraw/element/types'
const ExcalidrawCanvas = dynamic(
  async () => (await import('./ExcalidrawCanvas')).default,
  {
    ssr: false,
    loading: () => {
      console.log('excalidraw')

      return <div>Loading</div>
    }
  }
)

export const ExcalidrawComponent = (props: NodeViewProps) => {
  return (
    <NodeViewWrapper>
      <div
        data-drag-handle
        className='h-56 flex items-center justify-center relative'
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
          <div className='absolute top-2 right-2 rounded-md border border-eva-text-border p-1.5 cursor-pointer hover:bg-eva-text-border'>
            <Edit2Icon size={16} />
          </div>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[700px] h-full max-h-[500px] grid-rows-[auto_minmax(0,_1fr)_auto]'>
        <DialogHeader>
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
