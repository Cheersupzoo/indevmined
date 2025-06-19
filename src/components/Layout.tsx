import React from 'react'

import { cn } from '@/lib/utils'

import Footer from './Footer'
import { Header } from './Header'

type Props = React.PropsWithChildren<{
  en?: string
  th?: string
  className?: string
  isEN?: boolean
  footer?: React.ReactElement
}>
export default function Layout({
  children,
  en,
  th,
  className,
  isEN,
  footer = <Footer className={className} />,
}: Props) {
  return (
    <div className={cn('flex flex-col', className)}>
      <Header en={en} th={th} className={className} isEN={isEN} />
      <div className='flex flex-grow flex-col'>{children}</div>
      {footer}
    </div>
  )
}

export function NormalResponsive({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        'relative mx-auto w-full max-w-2xl px-4 text-lg text-text sm:px-0',
        className
      )}
    >
      {children}
    </div>
  )
}
