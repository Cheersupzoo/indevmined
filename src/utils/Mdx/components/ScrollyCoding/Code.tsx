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

export async function Code({
  codeblock,
  copy,
  collapse
}: {
  codeblock: RawCode
  copy?: boolean
  collapse?: boolean
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
          wordWrap,
          lineNumbers,
          callout,
          diff
        ]}
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

const bgHandler: AnnotationHandler = {
  name: 'bg',
  Inline: ({ children, annotation }) => {
    const color =
      annotation.query === '!+'
        ? 'rgb(63 185 80 / 0.1)'
        : 'rgb(249 168 212 / 0.2)'

    return (
      <span
        style={{
          display: 'inline-block',
          textIndent: '0',
          backgroundColor: color
        }}
      >
        {children}
      </span>
    )
  }
}

const mark: AnnotationHandler = {
  name: 'mark',
  Line: ({ annotation, ...props }) => {
    const color = annotation?.query || 'rgb(14 165 233)'

    return (
      <div
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
        className='rounded px-0.5 py-0 -mx-0.5'
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

const specialCallouts = ['info', 'warn', 'error']
const callout: AnnotationHandler = {
  name: 'callout',
  transform: (annotation: InlineAnnotation) => {
    const { name, query, lineNumber, fromColumn, toColumn, data } = annotation

    const splitQuery = query.split(' ')
    let className = ''
    let finalQuery = query
    if (splitQuery[0].startsWith('!')) {
      switch (splitQuery[0]) {
        case '!error':
          className += 'text-red-400'
          finalQuery = splitQuery.slice(1).join(' ')
          break
        case '!warn':
          className += 'text-amber-400'
          finalQuery = splitQuery.slice(1).join(' ')
          break
        case '!info':
          className += 'text-blue-400'
          finalQuery = splitQuery.slice(1).join(' ')
          break
        default:
          break
      }
    }

    return {
      name,
      query: finalQuery,
      fromLineNumber: lineNumber,
      toLineNumber: lineNumber,
      data: {
        ...data,
        column: (fromColumn + toColumn) / 2,
        className
      }
    }
  },
  AnnotatedLine: (props) => {
    const { column, className } = props.annotation.data

    return (
      <InnerLine merge={props}>
        {props.children}
        <div
          style={{
            minWidth: `${column + 4}ch`
          }}
          className={cn(
            'w-fit border bg-background border-current rounded px-2 relative -ml-[1ch] mt-1 whitespace-break-spaces',
            className
          )}
        >
          <div
            style={{ left: `${column}ch` }}
            className='absolute border-l border-t border-current w-2 h-2 rotate-45 -translate-y-1/2 -top-[1px] bg-background'
          />
          {props.annotation.query}
        </div>
      </InnerLine>
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
        <InnerLine merge={props} />
      </div>
    )
  }
}

export const diff: AnnotationHandler = {
  name: 'diff',
  onlyIfAnnotated: true,
  transform: (annotation: BlockAnnotation) => {
    const color = annotation.query == '-' ? '#f85149' : '#3fb950'
    return [annotation, { ...annotation, name: 'mark', query: color }]
  },
  Line: ({ annotation, ...props }) => (
    <>
      <div className='min-w-[1ch] box-content opacity-70 pl-2 select-none'>
        {annotation?.query}
      </div>
      <InnerLine merge={props} />
    </>
  )
}
