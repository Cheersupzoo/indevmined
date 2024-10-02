'use client'
import { CornerDownRight, MessageCircleQuestion, Search, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import './style.css'
import { micromark } from 'micromark'
import cs from 'classnames'
import { getAnswerIterator } from '@/apis'
import AutoAnimateHeight from './AutoAnimateHeight'

const squareLoader = `<span class='square-loader' />`

const exampleQuestions = [
  'Why use Generative AI?',
  'เมื่อไหร่ควรนำ Gen AI มาใช้',
  'How to update Generative AI knowledge'
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
      changeContent('')
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
      className={cs(
        {
          'bg-foreground/90': isActive,
          'border-text': !isActive
        },
        'border rounded-2xl py-3 pl-6 pr-6',
        'backdrop-blur-sm'
      )}
    >
      <div className='flex relative items-center'>
        <Search size={20} strokeWidth={3} />
        <input
          value={question}
          disabled={isLoading}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          placeholder='Ask AI about any posts on InDevMined in 🇬🇧 or 🇹🇭'
          className='bg-transparent  w-full mx-2 focus:outline-none'
        />
        <button
          className='mr-4 cursor-pointer disabled:hidden'
          disabled={isLoading || !question.length}
          onClick={onClear}
        >
          <X strokeWidth={2} />
        </button>
        <button
          className='bg-color1 rounded-xl cursor-pointer disabled:bg-slate-600'
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
      <div className='h-[0.05rem] mx-16 bg-text' />
      <div className='h-4'></div>
      <div className='text-color2 text-center'>{error}</div>
      <AutoAnimateHeight expanded={!isActive}>
        <div className='mb-1'>Try Ask</div>
        {exampleQuestions.map((question) => (
          <div
            key={question}
            onClick={() => onChooseExampleQuestion(question)}
            className='cursor-pointer flex items-center hover:bg-slate-200/15 mb-1 px-1 py-1 rounded-xl'
          >
            <MessageCircleQuestion className='mr-2' /> {question}
          </div>
        ))}
      </AutoAnimateHeight>
      <div className='answer px-2 ' ref={answerRef}></div>
      <AutoAnimateHeight expanded={isActive}>
        <div className='h-1'></div>
      </AutoAnimateHeight>
    </div>
  )
}

export default Question
