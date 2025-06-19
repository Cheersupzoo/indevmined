'use client'

import React, { useRef, useState } from 'react'

import { getAnswerIterator } from '@/apis'
import { CornerDownRight, MessageCircleQuestion, Search, X } from 'lucide-react'
import { micromark } from 'micromark'

import { cn } from '@/lib/utils'

import { AutoAnimateHeight } from '../AutoAnimateHeight'
import './style.css'

const squareLoader = `<span class='square-loader' />`

const exampleQuestions = [
  'Why use Generative AI?',
  'เมื่อไหร่ควรนำ Gen AI มาใช้',
  'How to update Generative AI knowledge',
]

const Question = () => {
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const answerRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeContent = (newContent: string) => {
    if (answerRef.current) {
      const currentHeight = answerRef.current.clientHeight
      answerRef.current.innerHTML = newContent
      answerRef.current.style.height = 'auto'
      const newHeight = answerRef.current.clientHeight
      answerRef.current.style.height = currentHeight + 'px'
      void answerRef.current.offsetHeight
      answerRef.current.style.height = newHeight + 'px'
    }
  }

  const setupLoadingIndicator = () => {
    if (answerRef.current) {
      answerRef.current.innerHTML = squareLoader
      answerRef.current.style.height = '0px'
      void answerRef.current.offsetHeight
      answerRef.current.style.height = ' 1.2em'
    }
  }

  const onClear = () => {
    changeContent('')
    setQuestion('')
    setIsActive(false)
    setError(null)
  }

  const onSubmit = async (overrideQuestion?: string) => {
    setError(null)
    setIsActive(true)
    setIsLoading(true)
    setupLoadingIndicator()
    try {
      const iterator = await getAnswerIterator(overrideQuestion ?? question)
      if (!iterator) {
        return
      }
      let answer = ''
      for await (const update of iterator) {
        const { value } = update
        answer += value
        changeContent(
          micromark(answer + squareLoader, { allowDangerousHtml: true })
        )
      }
      changeContent(micromark(answer, { allowDangerousHtml: true }))
    } catch (e) {
      console.trace(e)
      setError('Something went wrong. Please try again later.')
      changeContent('Sorry, something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const onChooseExampleQuestion = (question: string) => {
    setQuestion(question)
    onSubmit(question)
  }

  return (
    <div
      className={cn(
        {
          'bg-foreground/90': isActive,
          'border-text bg-foreground/60': !isActive,
        },
        'rounded-2xl border py-3 pl-6 pr-6',
        'backdrop-blur-sm transition-colors'
      )}
    >
      <div className='relative flex items-center'>
        <Search size={20} strokeWidth={3} />
        <input
          value={question}
          disabled={isLoading}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          placeholder='Ask Ham about any posts on InDevMined in 🇬🇧 or 🇹🇭'
          className='mx-2 w-full bg-transparent focus:outline-none'
        />
        <button
          className='mr-4 cursor-pointer disabled:hidden'
          disabled={isLoading || !question.length}
          onClick={onClear}
        >
          <X strokeWidth={2} />
        </button>
        <button
          className='cursor-pointer rounded-xl bg-color1 disabled:bg-slate-600'
          disabled={isLoading}
          onClick={() => onSubmit()}
        >
          <CornerDownRight
            className='h-7 w-10 -scale-x-100 p-1'
            strokeWidth={2}
          />
        </button>
      </div>
      <div className='h-3'></div>
      <div className='mx-16 h-[0.05rem] bg-text' />
      <div className='h-4'></div>
      <div className='text-center text-color2'>{error}</div>
      <AutoAnimateHeight expanded={!isActive}>
        <div className='mb-1'>Try Ask</div>
        {exampleQuestions.map((question) => (
          <div
            key={question}
            onClick={() => onChooseExampleQuestion(question)}
            className='mb-1 flex cursor-pointer items-center rounded-xl px-1 py-1 hover:bg-slate-200/15'
          >
            <MessageCircleQuestion className='mr-2' /> {question}
          </div>
        ))}
      </AutoAnimateHeight>
      <div className='answer px-2' ref={answerRef}></div>
      <AutoAnimateHeight expanded={isActive}>
        <div className='h-1'></div>
      </AutoAnimateHeight>
    </div>
  )
}

export default Question
