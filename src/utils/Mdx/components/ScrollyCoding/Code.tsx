import {
  AnnotationHandler,
  Pre,
  RawCode,
  highlight,
} from 'codehike/code'

import { FloatCopyButton } from '@/components/CopyButton'

import {
  bgHandler,
  callout,
  diff,
  lineNumbers,
  mark,
  wordWrap,
} from './CodeAnotationHandler'
import { CodeCollapsible } from './CodeCollapsible.client'
import { MermaidLanguageRenderer } from './MermaidLanguageRenderer'
import { tokenTransitions } from './tokenTransitions'

export const renderCode = async ({
  codeblock,
  noWrap,
}: {
  codeblock: RawCode
  noWrap?: boolean
}) => {
  const highlighted = await highlight(codeblock, 'dark-plus')
  let code: React.JSX.Element
  if (highlighted.lang === 'mermaid') {
    code = (
      <div className='mx-2 mb-4'>
        <MermaidLanguageRenderer codeblock={codeblock} />
      </div>
    )
  } else {
    code = (
      <Pre
        code={highlighted}
        handlers={
          [
            tokenTransitions,
            bgHandler,
            mark,
            !noWrap && wordWrap,
            lineNumbers,
            callout,
            diff,
          ].filter(Boolean) as AnnotationHandler[]
        }
        className='bg-transparent text-[0.9rem]'
      />
    )
  }

  return { highlighted, code }
}

export async function Code({
  codeblock,
  copy,
  collapse,
  noWrap,
}: {
  codeblock: RawCode
  copy?: boolean
  collapse?: boolean
  noWrap?: boolean
}) {
  const { highlighted, code } = await renderCode({
    codeblock,
    noWrap,
  })
  return (
    <>
      {!!highlighted.meta.length && (
        <div className='py-2 text-center font-mono text-xs text-zinc-400'>
          {highlighted.meta}
        </div>
      )}
      {copy && <FloatCopyButton text={codeblock.value} />}
      {collapse ? (
        <CodeCollapsible>
          <div className='overflow-auto rounded-b'>{code}</div>
        </CodeCollapsible>
      ) : (
        <div className='overflow-auto rounded-b'>{code}</div>
      )}
    </>
  )
}
