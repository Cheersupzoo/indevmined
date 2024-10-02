import Link from 'next/link'
import React from 'react'

type Props = { en?: string; th?: string }

export const Header = ({ en, th }: Props) => {
  return (
    <header className='relative left-0 right-0 top-0 z-50 mx-auto h-24 w-full max-w-2xl bg-transparent pt-6 px-4 sm:px-0'>
      <div className='flex items-center py-3 justify-between'>
        <div className='flex items-end space-x-6'>
          <Link href='/' className='text-eva-text font-bold text-2xl'>
            InDevMined
          </Link>
          <Link
            href={en ? '/post' : '/en/post'}
            className='text-eva-text font-bold text-lg hover:text-color3'
          >
            Post
          </Link>
        </div>
        <div>
          {en && (
            <Link
              href={en}
              className='text-eva-text font-bold text-lg hover:text-color1'
            >
              EN
            </Link>
          )}
          {th && (
            <Link
              href={th}
              className='text-eva-text font-bold text-lg hover:text-color1'
            >
              TH
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
