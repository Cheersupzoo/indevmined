'use client'

import dynamic from 'next/dynamic'

import './debugEditor.css'

const Type1 = dynamic(() => import('./Type1').then((m) => m.Type1))
const Type2 = dynamic(() => import('./Type2').then((m) => m.Type2))
const Type3 = dynamic(() => import('./Type3').then((m) => m.Type3))
const Type4 = dynamic(() => import('./Type4').then((m) => m.Type4))
const Type5 = dynamic(() => import('./Type5').then((m) => m.Type5))
const Type6 = dynamic(() => import('./Type6').then((m) => m.Type6))

export const TypeRenderer = ({ type }: { type: number }) => {
  return (
    <div>
      {type === 1 && <Type1 />}
      {type === 2 && <Type2 />}
      {type === 3 && <Type3 />}
      {type === 4 && <Type4 />}
      {type === 5 && <Type5 />}
      {type === 6 && <Type6 />}
    </div>
  )
}
