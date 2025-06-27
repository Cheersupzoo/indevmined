'use client'

import { NodeViewProps } from '@tiptap/core'

export const ToggleSectionStatic = (
  props: React.PropsWithChildren<NodeViewProps>
) => {
  return (
    <section data-collapsed={true}>
      <div
        onClick={(e) => {
          const section = e.currentTarget.closest('section')
          if (!section) return
          section.dataset.collapsed =
            section.dataset.collapsed === 'true' ? 'false' : 'true'
        }}
        className='toggle'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='lucide lucide-chevron-down-icon lucide-chevron-down'
        >
          <path fill='currentColor' d='m 6 9 l 6 6 l 6 -6 Z' />
        </svg>
      </div>
      <div className='toggle-content'>{props.children}</div>
    </section>
  )
}
