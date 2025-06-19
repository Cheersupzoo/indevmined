'use client'

import { useEffect, useRef } from 'react'

import { animate, useAnimate, useInView } from 'motion/react'

import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight'
import { TypewriterEffect } from '@/components/ui/typewriter-effect'

const words = [
  {
    text: '404',
    className: 'text-red-500 dark:text-red-500',
    breakLine: true,
  },
  {
    text: 'Page',
  },
  {
    text: 'Not',
  },
  {
    text: 'Found',
  },
]

export default function NotFound() {
  const typeWriterEffectRef =
    useRef<React.ElementRef<typeof TypewriterEffect>>(null)
  const highlightRef = useRef<React.ElementRef<typeof Highlight>>(null)

  const mainRef = useRef(null)
  const isInView = useInView(mainRef)
  const [pScope, pAnimate] = useAnimate()

  useEffect(() => {
    const startAnimate = async () => {
      await typeWriterEffectRef.current?.start()
      await animate([
        [
          pScope.current,
          { opacity: 1, transform: 'translateY(0px)' },
          { delay: 0.2, duration: 0.7, ease: 'easeInOut' },
        ],
        highlightRef.current?.animate()!,
      ])
    }

    startAnimate()
  }, [isInView])

  return (
    <main ref={mainRef}>
      <HeroHighlight containerClassName='h-screen'>
        <div className='flex h-full flex-col items-center justify-center'>
          <div>
            <TypewriterEffect
              ref={typeWriterEffectRef}
              words={words}
              cursorClassName='bg-red-500'
            />
          </div>
          <div className='mt-12 h-1 w-full max-w-[80%] rounded-xl bg-neutral-600 dark:bg-neutral-200' />
          <p
            ref={pScope}
            className='mt-6 -translate-y-8 text-xl text-neutral-600 opacity-0 dark:text-neutral-200'
          >
            In Dev{' '}
            <Highlight
              ref={highlightRef}
              className='font-medium text-neutral-700 dark:text-neutral-300'
            >
              Mined
            </Highlight>
            <span> 🧠⛏️</span>
          </p>
        </div>
      </HeroHighlight>
    </main>
  )
}
