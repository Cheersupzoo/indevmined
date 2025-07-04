import { renderCode } from '@/utils/Mdx/components/ScrollyCoding/Code'
import type { Node } from '@tiptap/pm/model'
import { CodeAnnotation, RawCode } from 'codehike/code'

const markToCodeAnnotation = (
  textNode?: readonly Node[],
  lineMarks?: number[],
  twoslash?: Record<string, any>
) => {
  const codeAnnotation: CodeAnnotation[] = []

  if (textNode) {
    let line = 1
    let fromColumn = 1
    textNode.forEach((node) => {
      if (node.type.name === 'text') {
        if (!node.marks.length) {
          const texts = node.text!.split('\n')
          line += texts.length - 1
          if (texts.length > 1) {
            fromColumn = 1
          }
          const lastLine = texts.pop()!

          fromColumn = fromColumn + lastLine.length

          return
        }
        node.marks.forEach((mark) => {
          if (mark.type.name === 'highlightMark') {
            codeAnnotation.push({
              name: 'bg',
              query: mark.attrs.color,
              lineNumber: line,
              fromColumn: fromColumn,
              toColumn: fromColumn + node.text!.length - 1,
            })
            fromColumn += node.text!.length
          }
        })
      }
    })
  }

  if (lineMarks) {
    lineMarks.forEach((line) => {
      codeAnnotation.push({
        name: 'mark',
        query: 'gold',
        fromLineNumber: line,
        toLineNumber: line,
      })
    })
  }

  if (twoslash) {
    if (twoslash.hovers) {
      twoslash.hovers.forEach(
        ({ text, line, character, length, docs }: any) => {
          codeAnnotation.push({
            name: 'tooltip',
            query: text,
            data: {
              docs,
            },
            lineNumber: line + 1,
            fromColumn: character + 1,
            toColumn: character + length,
          })
        }
      )
    }
  }

  return codeAnnotation
}

export const CodeAsync = async ({
  codeblock,
  noWrap,
  textNode,
  lineMarks,
  twoslash,
}: {
  codeblock: RawCode
  noWrap?: boolean
  textNode?: readonly Node[]
  lineMarks?: number[]
  twoslash?: Record<string, any>
}) => {
  const codeAnnotation = markToCodeAnnotation(textNode, lineMarks, twoslash)
  const { code } = await renderCode({ codeblock, noWrap, codeAnnotation })

  return code
}
