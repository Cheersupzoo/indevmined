'use client'

import { useMemo, useRef, useState } from 'react'

import { Slice } from '@tiptap/pm/model'
import { schema } from '@tiptap/pm/schema-basic'
import { EditorState, Transaction } from '@tiptap/pm/state'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { ReactStateRenderer } from './ReactStateRenderer'

const initialEditorState = () =>
  EditorState.create({
    schema,
    doc: schema.nodes.doc.create(null, [
      schema.nodes.paragraph.create(null, [schema.text('First paragraph')]),
      schema.nodes.paragraph.create(null, [schema.text('Second paragraph')]),
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

const tr0 = initialEditorState().tr
const tr1 = tr0
const tr4 = initialEditorState().tr.delete(0, 17)
const tr5 = initialEditorState()
  .tr.delete(0, 17)
  .insert(tr4.mapping.map(35), tr1.doc.slice(0, 17).content)

const states: {
  description: React.ReactNode
  decorations: { pos: number; element: React.ReactNode }[]
  transaction: Transaction
  slice?: Slice
  showPos: boolean
}[] = [
  {
    description: (
      <div>
        <div>
          Starting the process to move first paragraph to after second paragraph
        </div>
        <div className='h-[30px]' />
      </div>
    ),
    decorations: [
      {
        pos: 1,
        element: <Cursor />,
      },
    ],
    transaction: tr0,
    showPos: false,
  },
  {
    description: (
      <div>
        <div>
          Step 1&2: Locating the first paragrph node position and drop position
        </div>
        <div className='h-[30px]' />
      </div>
    ),
    decorations: [
      {
        pos: 0,
        element: (
          <span className='ml-1 inline-block -translate-x-5 translate-y-2 rounded-md border-2 border-color3 pl-5 pr-1 font-mono text-sm'>
            {'<-'} `before` Node position
          </span>
        ),
      },
      {
        pos: 1,
        element: <Cursor />,
      },
      {
        pos: 17,
        element: (
          <span className='ml-1 inline-block -translate-x-6 translate-y-2 rounded-md border-2 border-color3 pl-6 pr-1 font-mono text-sm'>
            {'<-'} `after` Node position
          </span>
        ),
      },
      {
        pos: 35,
        element: (
          <span className='ml-1 inline-block -translate-x-6 translate-y-2 rounded-md border-2 border-color3 pl-6 pr-1 font-mono text-sm'>
            {'<-'} Drop position
          </span>
        ),
      },
    ],
    transaction: tr1,
    showPos: true,
  },
  {
    description: (
      <div>
        <div>Step 3: Get the slice of the hovered node</div>
        <code className='code-inline'>tr.doc.slice(before, after)</code>
      </div>
    ),
    decorations: [
      {
        pos: 0,
        element: (
          <span className='ml-1 inline-block translate-y-2 font-mono text-xs'>
            0 {'<-'} Node position. AKA `before`
          </span>
        ),
      },
      {
        pos: 1,
        element: <Cursor />,
      },
      {
        pos: 17,
        element: (
          <span className='ml-1 inline-block translate-y-2 font-mono text-xs'>
            17 {'<-'} `after`
          </span>
        ),
      },
      {
        pos: 35,
        element: (
          <span className='ml-1 inline-block translate-y-2 font-mono text-xs'>
            35 {'<-'} Drop position
          </span>
        ),
      },
    ],
    transaction: tr1,
    slice: tr1.doc.slice(0, 17),
    showPos: false,
  },
  {
    description: (
      <div>
        <div>Step 4: Delete the hovered node from doc</div>
        <code className='code-inline'>tr.delete(before, after)</code>
      </div>
    ),
    decorations: [
      {
        pos: 1,
        element: <Cursor />,
      },
      {
        pos: 35,
        element: (
          <span className='ml-1 inline-block translate-y-2 rounded-md border-2 border-color3 px-1 font-mono text-xs'>
            35 {'<-'} Drop position now invalid
          </span>
        ),
      },
    ],
    transaction: tr4,
    slice: tr1.doc.slice(0, 17),
    showPos: false,
  },
  {
    description: (
      <div>
        <div> Step 5.1: Map the drop position to the new transaction</div>
        <code className='code-inline'>tr.mapping.map(35)</code>
      </div>
    ),
    decorations: [
      {
        pos: 1,
        element: <Cursor />,
      },
      {
        pos: tr4.mapping.map(35),
        element: (
          <span className='ml-1 inline-block translate-y-2 rounded-md border-2 border-color3 px-1 font-mono text-xs'>
            {tr4.mapping.map(35)} {'<-'} Updated drop position
          </span>
        ),
      },
    ],
    transaction: tr4,
    slice: tr1.doc.slice(0, 17),
    showPos: false,
  },
  {
    description: (
      <div>
        <div>Step 5.2:Insert the slice at the updated drop position</div>
        <code className='code-inline'>
          tr.insert(updatedDropPos, slice.content)
        </code>
      </div>
    ),
    decorations: [
      {
        pos: 1,
        element: <Cursor />,
      },
    ],
    transaction: tr5,
    showPos: false,
  },
  {
    description: (
      <div>
        <div>Step 6: Update selection position to draggedNode node</div>
        <code className='code-inline'>
          tr.setSelection(TextSelection.create(tr.doc, updatedDropPos + 1))
        </code>
      </div>
    ),
    decorations: [
      {
        pos: 19,
        element: <Cursor className='bg-color3' />,
      },
    ],
    transaction: tr5,
    showPos: false,
  },
]

export const Type5 = () => {
  const [step, setStep] = useState(0)

  const decorationsMap = useMemo(() => {
    const map: Record<number, React.ReactNode[]> = {}

    states[step].decorations.forEach((decoration) => {
      if (map[decoration.pos]) {
        map[decoration.pos].push(decoration.element)
      } else {
        map[decoration.pos] = [decoration.element]
      }
    })

    return map
  }, [step])

  return (
    <>
      <div className='!mb-1'>{states[step].description}</div>
      <div className='mt-1 flex items-center space-x-2'>
        <div className='text-eva-text/80'>Step</div>
        <Button
          size='icon'
          variant='secondary'
          className='size-8'
          disabled={step === 0}
          onClick={() => setStep((prev) => (prev > 0 ? prev - 1 : prev))}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          size='icon'
          variant='secondary'
          className='size-8'
          disabled={step === states.length - 1}
          onClick={() => {
            setStep((prev) => (prev < states.length - 1 ? prev + 1 : prev))
            console.log(tr1.doc.slice(0, 17))
          }}
        >
          <ChevronRightIcon />
        </Button>
      </div>
      <div className='relative mt-2 grid grid-cols-2 gap-2 font-mono'>
        <ReactStateRenderer
          node={states[step].transaction.doc}
          showPos={states[step].showPos}
          decorationsMap={decorationsMap}
        />

        <div className='rounded-xl bg-zinc-800 p-2 font-mono'>
          <div className='text-sm text-eva-text/70'>Slice</div>
          {!states[step].slice && <span className='text-sm'>empty</span>}
          {states[step].slice && (
            <div
              className={cn(
                step === 2 && 'w-fit rounded-xl border-2 border-color3'
              )}
            >
              <ReactStateRenderer
                node={states[step].slice.content}
                showPos={states[step].showPos}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
