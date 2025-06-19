'use client'

import React, { forwardRef, useImperativeHandle } from 'react'

import {
  motion,
  useAnimate,
  useMotionTemplate,
  useMotionValue,
} from 'motion/react'

import { cn } from '@/lib/utils'

export const HeroHighlight = ({
  children,
  className,
  showGradient = true,
  containerClassName,
}: {
  children: React.ReactNode
  className?: string
  showGradient?: boolean
  containerClassName?: string
}) => {
  let mouseX = useMotionValue(0)
  let mouseY = useMotionValue(0)

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return
    let { left, top } = currentTarget.getBoundingClientRect()

    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      className={cn(
        'group relative flex h-[40rem] w-full items-center justify-center',
        containerClassName
      )}
      onMouseMove={handleMouseMove}
    >
      <div className='pointer-events-none absolute inset-0 bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800' />
      <motion.div
        className='pointer-events-none absolute inset-0 opacity-0 transition duration-700 bg-dot-thick-indigo-500 group-hover:opacity-100 dark:bg-dot-thick-indigo-500'
        style={{
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
        }}
      />
      {showGradient && (
        <div className='pointer-events-none absolute inset-0 h-full w-full bg-white [mask-image:radial-gradient(ellipse_at_center,transparent,white)] dark:bg-black' />
      )}
      <div className={cn('relative z-20', className)}>{children}</div>
    </div>
  )
}

export const Highlight = forwardRef<
  AnimatableRef,
  {
    children: React.ReactNode
    className?: string
  }
>(function Highlight({ children, className }, ref) {
  const [scope, animate] = useAnimate()

  useImperativeHandle(ref, () => ({
    async start() {
      return animate(
        scope.current,
        {
          backgroundSize: '100% 100%',
        },
        {
          duration: 0.7,
          ease: 'linear',
        }
      )
    },
    animate() {
      return [
        scope.current,
        {
          backgroundSize: '100% 100%',
        },
        {
          delay: -0.2,
          duration: 0.7,
          ease: 'linear',
        },
      ]
    },
  }))

  return (
    <span
      ref={scope}
      style={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
        display: 'inline',
        backgroundSize: '0% 100%',
      }}
      className={cn(
        `relative inline-block rounded-lg bg-gradient-to-r from-indigo-300 to-purple-300 px-1 pb-1 dark:from-indigo-500 dark:to-purple-500`,
        className
      )}
    >
      {children}
    </span>
  )
})
