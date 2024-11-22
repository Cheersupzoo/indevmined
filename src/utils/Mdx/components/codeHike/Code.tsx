import {
  AnnotationHandler,
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

export async function Code({
  codeblock,
  copy
}: {
  codeblock: RawCode
  copy?: boolean
}) {
  const highlighted = await highlight(codeblock, 'dark-plus')

  return (
    <>
      {!!highlighted.meta.length && (
        <div className='text-center text-zinc-400 text-xs py-2'>
          {highlighted.meta}
        </div>
      )}
      {copy && <FloatCopyButton text={codeblock.value} />}
      <div className='overflow-auto rounded-b'>
        <Pre
          code={highlighted}
          handlers={[
            tokenTransitions,
            bgHandler,
            mark,
            callout,
            wordWrap,
            lineNumbers
          ]}
          className='bg-transparent text-[0.9rem]'
        />
      </div>
    </>
  )
}

const bgHandler: AnnotationHandler = {
  name: 'bg',
  Inline: ({ children }) => <span className='bg-pink-300/20'>{children}</span>
}

const mark: AnnotationHandler = {
  name: 'mark',
  Line: ({ annotation, ...props }) => {
    const color = annotation?.query || 'rgb(14 165 233)'

    return (
      <div
        className='...'
        style={{
          borderLeft: 'solid 2px transparent',
          borderLeftColor: annotation && color,
          backgroundColor: annotation && `rgb(from ${color} r g b / 0.1)`
        }}
      >
        <InnerLine merge={props} className='px-2 flex-1' />
      </div>
    )
  },
  Inline: ({ annotation, children }) => {
    const color = annotation?.query || 'rgb(14 165 233)'

    return (
      <span
        className='...'
        style={{
          outline: `solid 1px rgb(from ${color} r g b / 0.5)`,
          background: `rgb(from ${color} r g b / 0.13)`
        }}
      >
        {children}
      </span>
    )
  }
}

const callout: AnnotationHandler = {
  name: 'callout',
  transform: (annotation: InlineAnnotation) => {
    const { name, query, lineNumber, fromColumn, toColumn, data } = annotation

    return {
      name,
      query,
      fromLineNumber: lineNumber,
      toLineNumber: lineNumber,
      data: { ...data, column: (fromColumn + toColumn) / 2 }
    }
  },
  Block: ({ annotation, children }) => {
    const { column } = annotation.data

    return (
      <>
        {children}
        <div
          style={{ minWidth: `${column + 4}ch`, left: `5ch` }}
          className='w-fit border bg-background border-current rounded px-2 relative -ml-[1ch] mt-1 whitespace-break-spaces'
        >
          <div
            style={{ left: `${column - 5}ch` }}
            className='absolute border-l border-t border-current w-2 h-2 rotate-45 -translate-y-1/2 -top-[1px] bg-background'
          />
          {annotation.query}
        </div>
      </>
    )
  }
}

export const wordWrap: AnnotationHandler = {
  name: 'word-wrap',
  Pre: (props) => <InnerPre merge={props} className='whitespace-pre-wrap' />,
  Line: (props) => (
    <InnerLine merge={props}>
      <div
        style={{
          textIndent: `${-props.indentation}ch`,
          marginLeft: `${props.indentation}ch`
        }}
      >
        {props.children}
      </div>
    </InnerLine>
  ),
  Token: (props) => <InnerToken merge={props} style={{ textIndent: 0 }} />
}

export const lineNumbers: AnnotationHandler = {
  name: 'line-numbers',
  Line: (props) => {
    const width = props.totalLines.toString().length + 1

    return (
      <div className='flex'>
        <span
          className='text-right text-zinc-500 select-none'
          style={{ minWidth: `${width}ch` }}
        >
          {props.lineNumber}
        </span>
        <InnerLine merge={props} className='flex-1 pl-2' />
      </div>
    )
  }
}
