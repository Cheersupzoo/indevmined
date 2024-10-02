import Link from 'next/link'
import React from 'react'

type Props = { en?: string; th?: string }

export const Header = ({ en, th }: Props) => {
  return (
    <header className='relative left-0 right-0 top-0 z-50 mx-auto h-24 w-full max-w-2xl bg-transparent pt-6 px-4 sm:px-0'>
      <div className='flex items-center py-3 justify-between'>
        <Link href='/' className='text-eva-text font-bold text-2xl'>
          InDevMined
        </Link>
        <div>
          {en && (
            <Link href={en} className='text-eva-text font-bold text-lg hover:text-[var(--green-color)]'>
              EN
            </Link>
          )}
          {th && (
            <Link href={th} className='text-eva-text font-bold text-lg hover:text-[var(--green-color)]'>
              TH
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
