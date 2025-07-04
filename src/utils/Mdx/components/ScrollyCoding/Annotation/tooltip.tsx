import { AnnotationHandler, Pre, highlight } from 'codehike/code'

import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.client'

export const tooltipAsync: AnnotationHandler = {
  name: 'tooltip',
  Inline: async ({ children, annotation }) => {
    const { query, data } = annotation

    const highlighted = await highlight(
      { value: query, lang: 'ts', meta: '' },
      'dark-plus'
    )

    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger className='cursor-pointer [&_span]:underline [&_span]:decoration-eva-text/50 [&_span]:decoration-dashed'>
            {children}
          </TooltipTrigger>
          <TooltipContent className='bg-zinc-900' sideOffset={0}>
            <div className='max-w-[--radix-tooltip-content-available-width]'>
              <Pre code={highlighted} className='m-0 bg-transparent p-1' />
              {data?.docs && (
                <>
                  <div className='-mx-3 h-[1px] bg-zinc-800' />
                  <pre className='p-1 text-eva-text'>{data.docs}</pre>
                </>
              )}
            </div>
            <TooltipArrow className='fill-zinc-900' />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  },
}
