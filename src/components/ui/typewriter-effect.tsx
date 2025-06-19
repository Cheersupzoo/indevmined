'use client'

import { forwardRef, useImperativeHandle } from 'react'

import { motion, stagger, useAnimate, useInView } from 'motion/react'

import { cn } from '@/lib/utils'

export const TypewriterEffect = forwardRef<
  AnimatableRef,
  {
    words: {
      text: string
      className?: string
      breakLine?: boolean
    }[]
    className?: string
    cursorClassName?: string
  }
>(function TypewriterEffect({ words, className, cursorClassName }, ref) {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(''),
    }
  })

  const [scope, animate] = useAnimate()

  useImperativeHandle(ref, () => ({
    async start() {
      return animate(
        'span',
        {
          display: 'inline-block',
          opacity: 1,
          width: 'fit-content',
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: 'easeInOut',
        }
      )
    },
    animate() {
      return [
        scope.current.querySelectorAll('span'),
        {
          display: 'inline-block',
          opacity: 1,
          width: 'fit-content',
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: 'easeInOut',
        },
      ]
    },
  }))

  const renderWords = () => {
    return (
      <motion.div ref={scope} className='inline'>
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className='inline-block'>
              {word.text.map((char, index) => (
                <motion.span
                  initial={{}}
                  key={`char-${index}`}
                  className={cn(
                    `hidden text-black opacity-0 dark:text-white`,
                    word.className
                  )}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          )
        })}
      </motion.div>
    )
  }

  return (
    <div
      className={cn(
        'px-12 text-center text-3xl font-bold md:text-3xl lg:text-5xl',
        className
      )}
    >
      {renderWords()}
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className={cn(
          'inline-block h-6 w-[4px] rounded-sm bg-blue-500 md:h-6 lg:h-10',
          cursorClassName
        )}
      ></motion.span>
    </div>
  )
})
