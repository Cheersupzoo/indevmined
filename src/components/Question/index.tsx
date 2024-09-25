'use client'
import { CornerDownRight, Search, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import './style.css'
import { micromark } from 'micromark'
import cs from 'classnames'
import { getAnswerIterator } from '@/apis'

const squareLoader = `<span class='square-loader' />`

const Question = () => {
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const answerRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)

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

  const onSubmit = async () => {
    setIsActive(true)
    setIsLoading(true)
    setupLoadingIndicator()
    try {
      const iterator = await getAnswerIterator(question)
      if(!iterator) {
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='group'>
      <div
        className={cs(
          {
            'rounded-b-none border-foreground bg-foreground': isActive,
            'border-text': !isActive
          },
          'focus-within:bg-foreground hover:bg-foreground relative flex items-center border  rounded-2xl py-3 pl-6 pr-6'
        )}
      >
        <Search size={20} strokeWidth={3} />
        <input
          value={question}
          disabled={isLoading}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          placeholder='Ask me any posts on InDevMined'
          className='bg-transparent  w-full mx-2 focus:outline-none'
        />
        <button
          className='mr-4 cursor-pointer disabled:hidden'
          disabled={isLoading || !question.length}
        >
          <X strokeWidth={2} />
        </button>
        <button
          className='bg-color1 rounded-xl cursor-pointer disabled:bg-slate-600'
          disabled={isLoading}
          onClick={onSubmit}
        >
          <CornerDownRight
            className=' -scale-x-100 p-1 w-10 h-7'
            strokeWidth={2}
          />
        </button>
      </div>
      <div
        className={cs('bg-foreground', 'rounded-b-2xl', { hidden: !isActive })}
      >
        <div className='h-[0.05rem] mx-16 bg-text' />
        <div className='h-4' />
        <div className='answer px-6 ' ref={answerRef}></div>
        <div className='h-4' />
      </div>
    </div>
  )
}

export default Question
