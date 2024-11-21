import {
  AnnotationHandler,
  InlineAnnotation,
  InnerLine,
  Pre,
  RawCode,
  highlight
} from 'codehike/code'
import { tokenTransitions } from './tokenTransitions'

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, 'dark-plus')

  return (
    <Pre
      code={highlighted}
      handlers={[tokenTransitions, bgHandler, mark, callout]}
      className=' bg-transparent text-[0.9rem]'
    />
  )
}

const bgHandler: AnnotationHandler = {
  name: 'bg',
  Inline: ({ children }) => <span className='bg-pink-300/20'>{children}</span>
}

const mark: AnnotationHandler = {
  name: 'mark',
  AnnotatedLine: ({ annotation, ...props }) => (
    <InnerLine merge={props} data-mark={true} />
  ),
  Line: (props) => (
    <InnerLine
      merge={props}
      className='px-2 border-l-4 border-transparent data-[mark]:border-color3 data-[mark]:bg-color3/10'
    />
  )
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
          style={{ minWidth: `${column + 4}ch`, left: `2ch` }}
          className='w-fit border bg-background border-current rounded px-2 relative -ml-[1ch] mt-1 whitespace-break-spaces'
        >
          <div
            style={{ left: `${column - 2}ch` }}
            className='absolute border-l border-t border-current w-2 h-2 rotate-45 -translate-y-1/2 -top-[1px] bg-background'
          />
          {annotation.query}
        </div>
      </>
    )
  }
}
