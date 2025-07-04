'use client'

import React, { useEffect, useState } from 'react'

import {
  bgHandler,
  callout,
  lineNumbers,
  mark,
} from '@/utils/Mdx/components/ScrollyCoding/Annotation/CodeAnotationHandler'
import { MermaidLanguageRenderer } from '@/utils/Mdx/components/ScrollyCoding/MermaidLanguageRenderer'
import {
  NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from '@tiptap/react'
import { HighlightedCode, Pre, RawCode, highlight } from 'codehike/code'
import { EditIcon } from 'lucide-react'
import diff from 'react-syntax-highlighter/dist/esm/languages/hljs/diff'

import { FloatCopyButton } from '@/components/CopyButton'

export const CodeBlock = (props: NodeViewProps) => {
  return (
    <NodeViewWrapper>
      <div
        className='pre group relative flex flex-col rounded bg-zinc-800 shadow-xl'
        contentEditable={false}
      >
        {!!props.node.attrs.lang.length && (
          <div className='py-2 text-center font-mono text-xs text-zinc-400'>
            <span
              className='cursor-pointer'
              onClick={() => {
                if (!props.editor) return
                const language = window.prompt(
                  'Change language',
                  props.node.attrs.lang
                )
                if (!language?.length) return
                props.updateAttributes({ lang: language })
              }}
            >
              {props.node.attrs.lang}
            </span>
          </div>
        )}
        <CodeSync
          codeblock={{
            value: props.node.textContent ?? '',
            lang: props.node.attrs.lang,
            meta: props.node.attrs.lang,
          }}
          copy
        />
        <button
          className='absolute right-7 top-1 rounded p-1 text-zinc-300 opacity-0 transition-opacity hover:bg-gray-400/20 group-hover:opacity-100'
          aria-label='Edit code'
          onClick={() => {
            if (!props.editor) return
            const code = window.prompt('Edit Code', props.node.textContent)
            if (!code || props.node.textContent === code) return
            const parentFrom = props.getPos()
            const parentTo = parentFrom + props.node.nodeSize
            const textFrom = parentFrom + 1
            const textTo = parentTo - 1
            props.view.dispatch(
              props.view.state.tr.replaceWith(
                textFrom,
                textTo,
                props.editor.schema.text(code)
              )
            )
          }}
        >
          <EditIcon size={16} />
        </button>
      </div>
    </NodeViewWrapper>
  )
}

export function CodeSync({
  codeblock,
  copy,
  collapse,
  noWrap,
  line = true,
}: {
  codeblock: RawCode
  copy?: boolean
  collapse?: boolean
  noWrap?: boolean
  line?: boolean
}) {
  const [highlighted, setHighlighted] = useState<HighlightedCode | null>(null)

  useEffect(() => {
    const render = async () => {
      setHighlighted(await highlight(codeblock, 'dark-plus'))
    }

    render()

    return () => {}
  }, [codeblock])

  if (!highlighted) return <div>Rendering</div>

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
          bgHandler,
          mark,
          line ? lineNumbers : null,
          callout,
          diff,
        ].filter(Boolean)}
        className='bg-transparent text-[0.9rem]'
      />
    )
  }

  return (
    <>
      {copy && <FloatCopyButton text={codeblock.value} />}
      <div className='overflow-auto rounded-b'>{code}</div>
    </>
  )
}

export const CodeBlockRenderer = ReactNodeViewRenderer(CodeBlock)
