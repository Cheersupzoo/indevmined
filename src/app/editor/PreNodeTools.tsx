import { GripVertical } from 'lucide-react'
import React, { memo } from 'react'

const PreNodeToolsImpl = () => {
  return (
    <div
      style={{ visibility: 'hidden' }}
      className='pre-node-tool-container absolute top-0 left-0 -translate-x-full pr-4 flex flex-row space-x-1'
    >
      <div
        className='drag-handle text-eva-text/60 hover:text-eva-text/70 hover:bg-eva-text/10 py-1 px-1 rounded-md cursor-grab'
        draggable
      >
        <GripVertical size={16} />
      </div>
    </div>
  )
}

export const PreNodeTools = memo(PreNodeToolsImpl)
