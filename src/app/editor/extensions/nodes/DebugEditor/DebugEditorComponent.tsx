'use client'

import React, { useEffect } from 'react'

import { Show, useObservable } from '@legendapp/state/react'
import { Editor, NodeViewProps, NodeViewWrapper } from '@tiptap/react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

import { TypeRenderer } from './TypeRenderer'

export const DebugEditorComponent = (props: NodeViewProps) => {
  const type = props.node.attrs.type ?? 1
  const isEditable$ = useObservable(props.editor?.isEditable ?? false)
  useEffect(() => {
    const update = ({ editor }: { editor: Editor }) => {
      isEditable$.set(editor.isEditable)
    }

    props.editor.on('update', update)
    return () => {
      props.editor.off('update', update)
    }
  }, [])
  return (
    <NodeViewWrapper>
      <div className='relative rounded-xl border border-eva-text-border py-3 px-5'>
        <Show if={isEditable$}>
          {() => (
            <div className='absolute left-0 top-0'>
              <TypeSelector
                type={type}
                setType={(type) => props.updateAttributes({ type })}
              />
            </div>
          )}
        </Show>
        <TypeRenderer type={type} />
      </div>
    </NodeViewWrapper>
  )
}

const types = [1, 2, 3, 4]

const TypeSelector = ({
  type,
  setType,
}: {
  type: number
  setType: (type: number) => void
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={cn('rounded-sm px-0.5 py-1 hover:bg-eva-text/10')}>
          {type}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className='w-52'
      >
        <DropdownMenuGroup>
          {types.map((type) => (
            <DropdownMenuItem key={type} onClick={() => setType(type)}>
              {type}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
