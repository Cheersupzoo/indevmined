'use client'

import { useState } from 'react'

import { Check, Copy } from 'lucide-react'

export function FloatCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      className='absolute right-1 top-1 rounded p-1 text-zinc-300 hover:bg-gray-400/20'
      aria-label='Copy to clipboard'
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      }}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  )
}
