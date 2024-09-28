import React from 'react'
import { FaFacebookSquare } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className='flex justify-between mx-auto h-24 w-full max-w-2xl bg-transparent pt-6 px-2 sm:px-0'>
      <div className='text-eva-text'>
        © 2024 In Dev Mined. All Rights Reserved.
      </div>
      <div className='text-eva-text text-2xl hover:text-[#1877F2]'>
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
