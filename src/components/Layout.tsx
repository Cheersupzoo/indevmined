import React from 'react'
import { Header } from './Header'
import Footer from './Footer'
import { cn } from '@/utils/cn'
type Props = React.PropsWithChildren<{
  en?: string
  th?: string
  className?: string
  isEN?: boolean
}>
export default function Layout({ children, en, th, className, isEN }: Props) {
  return (
    <div className={cn('flex flex-col', className)}>
      <Header en={en} th={th} className={className} isEN={isEN} />
      <div className='flex flex-grow flex-col'>{children}</div>
      <Footer className={className} />
    </div>
  )
}

export function NormalResponsive({
  children,
  className
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        'text-text relative mx-auto max-w-2xl w-full text-lg px-4 sm:px-0',
        className
      )}
    >
      {children}
    </div>
  )
}
