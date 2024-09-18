import React from 'react'
import { Header } from './Header'
import Footer from './Footer'
type Props = React.PropsWithChildren<{ en?: string; th?: string }>
export default function Wrapper({ children, en, th }: Props) {
  return (
    <div className='flex flex-col'>
      <Header en={en} th={th} />
      <div className='flex flex-grow flex-col'>{children}</div>
      <Footer />
    </div>
  )
}
