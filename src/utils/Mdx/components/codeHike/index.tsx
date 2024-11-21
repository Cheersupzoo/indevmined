import React from 'react'
import { z } from 'zod'
import { Block, CodeBlock, parseRoot } from 'codehike/blocks'
import { remarkCodeHike, recmaCodeHike } from 'codehike/mdx'
import {
  Selection,
  Selectable,
  SelectionProvider
} from 'codehike/utils/selection'
import { compileMDX } from 'next-mdx-remote/rsc'
import { Code } from './Code'
import { Code as CodeMdx } from '../code'

const Schema = Block.extend({
  steps: z.array(Block.extend({ code: CodeBlock.optional() }))
})

/** @type {import('codehike/mdx').CodeHikeConfig} */
const chConfig = {}

export const CodeHike = async (props: React.PropsWithChildren) => {
  const code = props.children as string
  let result
  try {
    result = await compileMDX({
      source: code,
      components: {
        Code: CodeMdx
      },
      options: {
        mdxOptions: {
          remarkPlugins: [[remarkCodeHike, chConfig]],
          recmaPlugins: [[recmaCodeHike, chConfig]]
        }
      }
    })
  } catch (e) {
    console.error(e)
    throw e
  }

  const { steps } = parseRoot(
    (props) =>
      (result.content as any).type({
        ...props,
        components: {
          Code: CodeMdx
        }
      }),
    Schema
  )

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
      <div className='sticky top-4 lg:static lg:w-[30vw] max-w-xl order-1 lg:order-2'>
        <div className='top-4 sticky'>
          <div className='bg-zinc-800 max-h-[40vh] lg:max-h-[80vh] rounded shadow-xl flex flex-col'>
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
