'use client'
import { CornerDownRight, MessageCircleQuestion, Search, X } from 'lucide-react'
import React, { Fragment, lazy, useState } from 'react'
import './style.css'
import { micromark } from 'micromark'
import cs from 'classnames'
import { getMathAnswerIterator } from '@/apis'
import { AutoAnimateHeight, EnterAnimateHeight } from '../AutoAnimateHeight'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
oneLight['pre[class*="language-"]'].margin = '0'
oneLight['pre[class*="language-"]'].borderRadius = '0'

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import { cn } from '@/utils/cn'
SyntaxHighlighter.registerLanguage('python', python)
const SquareLoader = () => <span className='square-loader bg-slate-700' />

const exampleQuestions = [
  'Find the area of circle when radius is 5',
  'How many r\'s in "raspberrrrry"',
  'What is the answer for x^2+2x+1 when x=3? And given a sentence "An apple a day keeps the doctor away", what is the order of the word "apple" in the sentence'
]

type Content = {
  id: string
  type: 'text' | 'code'
  value: string
  loading?: boolean
  result?: string
  error?: string
}

const MathQuestion = () => {
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contents, setContents] = useState<Content[]>([])

  const onSubmit = async (overrideQuestion?: string) => {
    setError(null)
    setIsActive(true)
    setIsLoading(true)
    setContents([])

    try {
      const iterator = await getMathAnswerIterator(overrideQuestion ?? question)
      if (!iterator) {
        return
      }

      if (typeof iterator === 'string') {
        setContents([{ id: '', type: 'text', value: iterator }])
        setIsLoading(false)
      }

      let contentBuffer: Content[] = []
      for await (const update of iterator) {
        const { id = '', value, codeId, code = '', error } = update
        if (!(value || code)) continue
        // TODO: Refactor Whole This block
        if (codeId) {
          const contentIndex = contentBuffer.findIndex(
            (content) => content.id === id
          )
          if (contentIndex !== -1) {
            contentBuffer = [...contentBuffer]
            contentBuffer[contentIndex] = {
              ...contentBuffer[contentIndex],
              loading: false,
              result: value,
              error
            }
          } else {
            contentBuffer = [
              ...contentBuffer,
              { id, type: 'code', value: code, loading: true }
            ]
          }
        } else {
          const contentIndex = contentBuffer.findIndex(
            (content) => content.id === id
          )
          if (contentIndex !== -1) {
            contentBuffer = [...contentBuffer]
            contentBuffer[contentIndex] = {
              ...contentBuffer[contentIndex],
              value: contentBuffer[contentIndex].value + value
            }
          } else {
            contentBuffer = [...contentBuffer, { id, type: 'text', value }]
          }
        }
        setContents(contentBuffer)
      }
    } catch (e) {
      console.trace(e)
      setContents([
        {
          id: '',
          type: 'text',
          value: 'Something went wrong. Please try again later.'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const onClear = () => {
    setContents([])
    setQuestion('')
    setIsActive(false)
  }

  const onChooseExampleQuestion = (question: string) => {
    setQuestion(question)
    onSubmit(question)
  }

  return (
    <div
      className={cs(
        {
          'border-text': !isActive
        },
        'border rounded-2xl border-amber-500/50 py-3 pl-6 pr-6 text-slate-700'
      )}
    >
      <div className='flex relative items-center '>
        <Search size={20} strokeWidth={3} color='rgb(245 158 11 / 0.8)' />
        <input
          value={question}
          disabled={isLoading}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          placeholder='Ask Mark anything relate to calculation'
          className='bg-transparent text-slate-700 w-full mx-2 focus:outline-none'
        />
        <button
          className='mr-4 cursor-pointer disabled:hidden'
          disabled={isLoading || !question.length}
          onClick={onClear}
        >
          <X strokeWidth={2} />
        </button>
        <button
          className='bg-amber-500/80 text-slate-100 rounded-xl cursor-pointer disabled:bg-slate-600'
          disabled={isLoading}
          onClick={() => onSubmit()}
        >
          <CornerDownRight
            className='-scale-x-100 p-1 w-10 h-7'
            strokeWidth={2}
          />
        </button>
      </div>
      <div className='h-3'></div>
      <div className='h-[0.05rem] mx-16 bg-amber-500/50' />
      <div className='h-4'></div>
      <div className='text-color2 text-center'>{error}</div>
      <AutoAnimateHeight expanded={!isActive}>
        <div className='mb-1'>Try Ask</div>
        {exampleQuestions.map((question) => (
          <div
            key={question}
            onClick={() => onChooseExampleQuestion(question)}
            className='cursor-pointer flex items-start hover:bg-slate-200/15 mb-1 px-1 py-1 rounded-xl'
          >
            <div className='mr-2 '>
              <MessageCircleQuestion size={24} />
            </div>{' '}
            <div className='flex-grow'>{question}</div>
          </div>
        ))}
      </AutoAnimateHeight>
      <div className='answer px-2 space-y-4'>
        {contents.map(({ value, type, loading, result }, index) => (
          <Fragment key={index}>
            {type === 'text' && <div>{value}</div>}
            {type === 'code' && (
              <EnterAnimateHeight className='text-sm  '>
                <div className='bg-slate-500 text-slate-100 pl-2 py-0.5 rounded-t-[.3em] text-xs'>
                  Python
                </div>
                <SyntaxHighlighter
                  PreTag='div'
                  language='python'
                  style={oneLight}
                >
                  {String(value).replace(/\n$/, '')}
                </SyntaxHighlighter>
                {
                  <div
                    className={cn(
                      'bg-slate-300 text-slate-700 pl-2 py-0.5 rounded-b-[.3em] text-sm font-mono',
                      loading && 'code-spinner'
                    )}
                  >
                    {loading && 'Running...'}
                    {!loading && <>Output: {result}</>}
                  </div>
                }
              </EnterAnimateHeight>
            )}
          </Fragment>
        ))}
        {isLoading && <SquareLoader />}
      </div>
      <AutoAnimateHeight expanded={isActive}>
        <div className='h-1'></div>
      </AutoAnimateHeight>
    </div>
  )
}

export default MathQuestion
