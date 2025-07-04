'use client'

import dynamic from 'next/dynamic'

export const Tooltip = dynamic(() =>
  import('./tooltip').then((mod) => mod.Tooltip)
)
export const TooltipArrow = dynamic(() =>
  import('./tooltip').then((mod) => mod.TooltipArrow)
)
export const TooltipContent = dynamic(() =>
  import('./tooltip').then((mod) => mod.TooltipContent)
)
export const TooltipProvider = dynamic(() =>
  import('./tooltip').then((mod) => mod.TooltipProvider)
)
export const TooltipTrigger = dynamic(() =>
  import('./tooltip').then((mod) => mod.TooltipTrigger)
)
