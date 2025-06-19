import Link from 'next/link'
import React from 'react'

import { cn } from '@/lib/utils'

type Props = { en?: string; th?: string; className?: string; isEN?: boolean }

export const Header = ({ en, th, className, isEN }: Props) => {
  return (
    <header
      className={cn(
        'relative left-0 right-0 top-0 z-50 mx-auto h-24 w-full max-w-2xl bg-transparent px-4 pt-6 text-eva-text sm:px-0',
        className
      )}
    >
      <div className='flex items-center justify-between py-3'>
        <div className='flex items-end space-x-6'>
          <Link href='/' className='text-2xl font-bold'>
            InDevMined
          </Link>
          <Link
            href={!isEN ? '/post' : '/en/post'}
            className='text-lg font-bold hover:text-color3'
          >
            Post
          </Link>
          <Link href='/ai-mark' className='text-lg font-bold hover:text-color3'>
            MarkAI
          </Link>
        </div>
        <div>
          {en && (
            <Link href={en} className='text-lg font-bold hover:text-color1'>
              EN
            </Link>
          )}
          {th && (
            <Link href={th} className='text-lg font-bold hover:text-color1'>
              TH
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
