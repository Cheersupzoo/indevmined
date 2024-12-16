import React from 'react'
import { z } from 'zod'
import { Block, CodeBlock, parseProps, parseRoot } from 'codehike/blocks'
import {
  Selection,
  Selectable,
  SelectionProvider
} from 'codehike/utils/selection'
import { Code } from './Code'

const Schema = Block.extend({
  steps: z.array(Block.extend({ code: CodeBlock.optional() }))
})

export const ScrollyCoding = async (props: React.PropsWithChildren) => {
  const { steps } = parseProps(props, Schema)

  return (
    <SelectionProvider className='flex flex-col lg:flex-row gap-4 relative lg:ml-[-10vw] lg:mr-[-10vw]'>
      <div className='lg:flex-1 prose prose-invert order-2 lg:order-1'>
        {steps.map((step, i) => (
          <Selectable
            key={i}
            index={i}
            selectOn={['click', 'scroll']}
            className='border-l-4 border-zinc-700 data-[selected=true]:border-color3 px-5 py-2 mb-24 rounded bg-text/5'
          >
            <h3 className='mt-4 text-xl'>{step.title}</h3>
            <div>{step.children}</div>
          </Selectable>
        ))}
      </div>
      <div className='sticky top-4 lg:static lg:w-[30vw] lg:max-w-xl order-1 lg:order-2'>
        <div className='top-4 sticky'>
          <div className='bg-zinc-800 max-h-[40vh] lg:max-h-[80vh] rounded shadow-xl flex flex-col relative'>
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
