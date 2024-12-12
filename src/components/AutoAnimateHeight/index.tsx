import React, { useEffect, useState } from 'react'
import './AutoAnimateHeight.css'
import { cn } from '@/utils/cn'

export const AutoAnimateHeight = ({
  children,
  expanded
}: React.PropsWithChildren<{ expanded?: boolean }>) => {
  return (
    <div className={cn('transition-height', { expanded })}>
      <div>{children}</div>
    </div>
  )
}

export const EnterAnimateHeight = ({
  children,
  className
}: React.PropsWithChildren<{ className?: string }>) => {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setExpanded(true)
  }, [])

  return (
    <div className={cn(className, 'transition-height', { expanded })}>
      <div>{children}</div>
    </div>
  )
}
