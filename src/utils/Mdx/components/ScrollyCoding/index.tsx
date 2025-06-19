import React from 'react'

import { Block, CodeBlock, parseProps, parseRoot } from 'codehike/blocks'
import {
  Selectable,
  Selection,
  SelectionProvider,
} from 'codehike/utils/selection'
import { z } from 'zod'

import { Code } from './Code'

const Schema = Block.extend({
  steps: z.array(Block.extend({ code: CodeBlock.optional() })),
})

export const ScrollyCoding = async (props: React.PropsWithChildren) => {
  const { steps } = parseProps(props, Schema)

  return (
    <SelectionProvider className='relative flex flex-col gap-4 lg:ml-[-10vw] lg:mr-[-10vw] lg:flex-row'>
      <div className='prose prose-invert order-2 lg:order-1 lg:flex-1'>
        {steps.map((step, i) => (
          <Selectable
            key={i}
            index={i}
            selectOn={['click', 'scroll']}
            className='mb-24 rounded border-l-4 border-zinc-700 bg-text/5 px-5 py-2 data-[selected=true]:border-color3'
          >
            <h3 className='mt-4 text-xl'>{step.title}</h3>
            <div>{step.children}</div>
          </Selectable>
        ))}
      </div>
      <div className='sticky top-4 order-1 lg:static lg:order-2 lg:w-[30vw] lg:max-w-xl'>
        <div className='sticky top-4'>
          <div className='relative flex max-h-[40vh] flex-col rounded bg-zinc-800 shadow-xl lg:max-h-[80vh]'>
            <Selection
              from={steps.map((step, i) => (
                <Code
                  key={i}
                  codeblock={step.code ?? { meta: '', value: '', lang: '' }}
                />
              ))}
            />
          </div>
        </div>
      </div>
    </SelectionProvider>
  )
}
