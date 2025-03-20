import {
  AnnotationHandler,
  BlockAnnotation,
  InlineAnnotation,
  InnerLine,
  InnerPre,
  InnerToken,
  Pre,
  RawCode,
  highlight
} from 'codehike/code'
import { tokenTransitions } from './tokenTransitions'
import { FloatCopyButton } from '@/components/CopyButton'
import { MermaidLanguageRenderer } from './MermaidLanguageRenderer'
import { cn } from '@/utils/cn'
import { CodeCollapsible } from './CodeCollapsible.client'
import { bgHandler, callout, diff, lineNumbers, mark, wordWrap } from './CodeAnotationHandler'

export async function Code({
  codeblock,
  copy,
  collapse,
  noWrap
}: {
  codeblock: RawCode
  copy?: boolean
  collapse?: boolean
  noWrap?: boolean
}) {
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
        handlers={[
          tokenTransitions,
          bgHandler,
          mark,
          !noWrap && wordWrap,
          lineNumbers,
          callout,
          diff
        ].filter(Boolean) as AnnotationHandler[]}
        className='bg-transparent text-[0.9rem]'
      />
    )
  }

  return (
    <>
      {!!highlighted.meta.length && (
        <div className='text-center text-zinc-400 text-xs py-2 font-mono'>
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

