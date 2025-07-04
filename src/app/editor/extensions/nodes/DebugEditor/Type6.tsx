'use client'

import { useState } from 'react'

import { schema } from '@tiptap/pm/schema-basic'
import { EditorState } from '@tiptap/pm/state'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

import { ReactStateRenderer } from './ReactStateRenderer'

const initialEditorState = () =>
  EditorState.create({
    schema,
    doc: schema.nodes.doc.create(null, [
      schema.nodes.paragraph.create(null, [schema.text('My paragraph')]),
    ]),
  })

const Cursor = ({ className }: { className?: string }) => (
  <span
    className={cn(
      'inline-block h-4 w-[2px] translate-y-[1px] animate-blinking bg-eva-text',
      className
    )}
  ></span>
)

const tr = initialEditorState().tr

const decorationsMap = {
  0: [
    <span key='0' className='inline-block w-0'>
      <div className='translate-y-[calc(100%+0.4rem)]'>
        <div className='triangle-clip h-1 w-2 -translate-x-1/2 -translate-y-0.5 bg-color3' />
        <div className='w-fit -translate-y-1 translate-x-[calc(-100%+0.375rem)] text-xs text-color3'>
          before
        </div>
      </div>
    </span>,
  ],
  1: [
    <span key='0' className='inline-block w-0'>
      <div className='translate-y-[calc(100%+0.4rem)]'>
        <div className='triangle-clip h-1 w-2 -translate-x-1/2 -translate-y-0.5 bg-color3' />
        <div className='w-fit -translate-x-1.5 -translate-y-1 text-xs text-color3'>
          start
        </div>
      </div>
    </span>,
  ],
  6: [
    <Cursor key='0' />,
    <span key='1' className='inline-block w-0'>
      <div className='-translate-x-[1px] translate-y-[calc(100%+0.4rem)]'>
        <div className='triangle-clip h-1 w-2 -translate-x-1/2 -translate-y-0.5 bg-color3' />
        <div className='w-fit -translate-x-1/2 -translate-y-1 text-xs text-color3'>
          pos
        </div>
      </div>
    </span>,
  ],
  13: [
    <span key='0' className='inline-block w-0'>
      <div className='translate-y-[calc(100%+0.4rem)]'>
        <div className='triangle-clip h-1 w-2 -translate-x-1/2 -translate-y-0.5 bg-color3' />
        <div className='w-fit -translate-y-1 translate-x-[calc(-100%+0.375rem)] text-xs text-color3'>
          end
        </div>
      </div>
    </span>,
  ],
  14: [
    <span key='0' className='inline-block w-0'>
      <div className='translate-y-[calc(100%+0.4rem)]'>
        <div className='triangle-clip h-1 w-2 -translate-x-1/2 -translate-y-0.5 bg-color3' />
        <div className='w-fit -translate-x-1.5 -translate-y-1 text-xs text-color3'>
          after
        </div>
      </div>
    </span>,
  ],
}

export const Type6 = () => {
  const [showPos, setShowPos] = useState(false)

  return (
    <>
      <div className='!mb-1 font-medium'>ResolvedPos at 6</div>
      <div className='relative mt-2 flex justify-center font-mono [&_.paragraph]:pb-2'>
        <ReactStateRenderer
          node={tr.doc}
          showPos={showPos}
          decorationsMap={decorationsMap}
          groupClassName='flex flex-row items-center'
        />
      </div>
      <div className='mt-4 flex items-center space-x-2'>
        <Switch
          id='show-pos-6'
          checked={showPos}
          onClick={() => {
            setShowPos((prev) => !prev)
          }}
        />
        <Label className='cursor-pointer' htmlFor='show-pos-6'>
          Show Position Decoration
        </Label>
      </div>
    </>
  )
}
