import React from 'react'

import { FaFacebookSquare } from 'react-icons/fa'

import { cn } from '@/lib/utils'

const Footer = ({ className }: { className?: string }) => {
  return (
    <footer
      className={cn(
        'mx-auto flex h-24 w-full max-w-2xl justify-between bg-transparent px-4 pt-6 text-eva-text sm:px-0',
        className
      )}
    >
      <div>© 2024 In Dev Mined. All Rights Reserved.</div>
      <div className='text-2xl hover:text-[#1877F2]'>
        <a
          href={`https://www.facebook.com/profile.php?id=61558639690052`}
          title={`Facebook In Dev Mined`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <FaFacebookSquare />
        </a>
      </div>
    </footer>
  )
}

export default Footer
