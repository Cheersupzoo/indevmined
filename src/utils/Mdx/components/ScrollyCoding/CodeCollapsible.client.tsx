'use client'

import React, { useState } from 'react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible'
import { ChevronRight } from 'lucide-react'

import './CodeCollapsible.style.css'

export const CodeCollapsible = ({ children }: React.PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className='collapsible'>
      <CollapsibleTrigger asChild>
        <div className='collapsible-trigger group absolute left-2 top-2'>
          <ChevronRight className='h-4 w-4 group-hover:text-text' />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className='collapsible-content'>
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}
