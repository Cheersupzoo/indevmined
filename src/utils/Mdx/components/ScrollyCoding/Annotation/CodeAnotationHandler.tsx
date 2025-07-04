import {
  AnnotationHandler,
  BlockAnnotation,
  InlineAnnotation,
  InnerLine,
  InnerPre,
  InnerToken,
} from 'codehike/code'

import { cn } from '@/lib/utils'

export const bgHandler: AnnotationHandler = {
  name: 'bg',
  Inline: ({ children, annotation }) => {
    let color = 'rgb(249 168 212 / 0.2)'
    if (annotation.query === '!+') {
      color = 'rgb(63 185 80 / 0.1)'
    } else if (annotation.query.length) {
      color = `rgb(from ${annotation.query} r g b / 0.13)`
    }

    return (
      <span
        style={{
          display: 'inline-block',
          textIndent: '0',
          backgroundColor: color,
        }}
      >
        {children}
      </span>
    )
  },
}

export const mark: AnnotationHandler = {
  name: 'mark',
  Line: ({ annotation, ...props }) => {
    const color = annotation?.query || 'rgb(14 165 233)'

    return (
      <div
        style={{
          borderLeft: '2px solid transparent',
          borderLeftColor: annotation ? color : 'transparent',
          backgroundColor: annotation && `rgb(from ${color} r g b / 0.1)`,
        }}
      >
        <InnerLine merge={props} className='flex-1 px-2' />
      </div>
    )
  },
  Inline: ({ annotation, children }) => {
    const color = annotation?.query || 'rgb(14 165 233)'

    return (
      <span
        className='-mx-0.5 rounded px-0.5 py-0'
        style={{
          outline: `solid 1px rgb(from ${color} r g b / 0.5)`,
          background: `rgb(from ${color} r g b / 0.13)`,
        }}
      >
        {children}
      </span>
    )
  },
}

export const specialCallouts = ['info', 'warn', 'error']
export const callout: AnnotationHandler = {
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
        className,
      },
    }
  },
  AnnotatedLine: (props) => {
    const { column, className } = props.annotation.data

    return (
      <InnerLine merge={props}>
        {props.children}
        <div
          style={{
            minWidth: `${column + 4}ch`,
          }}
          className={cn(
            'relative -ml-[1ch] mt-1 w-fit whitespace-break-spaces rounded border border-current bg-background px-2',
            className
          )}
        >
          <div
            style={{ left: `${column}ch` }}
            className='absolute -top-[1px] h-2 w-2 -translate-y-1/2 rotate-45 border-l border-t border-current bg-background'
          />
          {props.annotation.query}
        </div>
      </InnerLine>
    )
  },
}

export const wordWrap: AnnotationHandler = {
  name: 'word-wrap',
  Pre: (props) => <InnerPre merge={props} className='whitespace-pre-wrap' />,
  Line: (props) => (
    <InnerLine merge={props}>
      <div
        style={{
          textIndent: `${-props.indentation}ch`,
          marginLeft: `${props.indentation}ch`,
        }}
      >
        {props.children}
      </div>
    </InnerLine>
  ),
  Token: (props) => <InnerToken merge={props} style={{ textIndent: 0 }} />,
}

export const lineNumbers: AnnotationHandler = {
  name: 'line-numbers',
  Line: (props) => {
    const width = props.totalLines.toString().length + 1

    return (
      <div className='flex'>
        <span
          className='select-none text-right text-zinc-500'
          style={{ minWidth: `${width}ch` }}
        >
          {props.lineNumber}
        </span>
        <InnerLine merge={props} />
      </div>
    )
  },
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
      <div className='box-content min-w-[1ch] select-none pl-2 opacity-70'>
        {annotation?.query}
      </div>
      <InnerLine merge={props} />
    </>
  ),
}
