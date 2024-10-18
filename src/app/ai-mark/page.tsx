import Layout, { NormalResponsive } from '@/components/Layout'
import MathQuestion from '@/components/MathQuestion'
import { Pi } from 'lucide-react'
import { Metadata } from 'next'
import EnhancedMathBackground from './MathBackground'
import './style.css'

export default function Home() {
  return (
    <Layout className='bg-slate-200 text-slate-800'>
      <div className='fixed inset-0 bg-slate-200' />
      <EnhancedMathBackground />
      <NormalResponsive>
        <div className='mt-8 text-4xl font-thin text-amber-700'>
          <span className='bg-gradient p-1 rounded-xl text-slate-50 '><Pi size={36} className='inline mb-2' /> Mark</span> - The Mathematician AI
        </div>
        <div className='mt-4 mb-4 text-sm text-slate-800'>
          Mark is exceptional at calculations and counting. As a Generative AI
          enhanced with a code interpreter, he can leverage programming skills
          to overcome limitations that probability alone cannot address. Why not
          put his abilities to the test?
        </div>
        <div className='bg-slate-50/50 shadow-lg p-2 rounded-3xl'>
          <MathQuestion />
          <div className='text-sm text-center text-zinc-500 mt-2'>
            Mark remains still far from perfection. Check important info.
          </div>
          <div className='text-sm text-center text-zinc-500 mt-2'>
            Made for fun with{' '}
            <a
              className='text-amber-600'
              href='https://nextjs.org'
              target='_blank'
            >
              Next.js
            </a>{' '}
            +{' '}
            <a
              className='text-amber-600'
              href='https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/MODEL_CARD.md'
              target='_blank'
            >
              Llama 3.1
            </a>{' '}
            70b on{' '}
            <a
              className='text-amber-600'
              href='https://groq.com'
              target='_blank'
            >
              Groq
            </a>{' '}
            +{' '}
            <a
              className='text-amber-600'
              href='https://e2b.dev'
              target='_blank'
            >
              E2B
            </a>
          </div>
        </div>
      </NormalResponsive>
    </Layout>
  )
}

export const metadata: Metadata = {
  title: 'AI Mark | In Dev Mined',
  description:
    'All In Dev Mined Home page. Ask AI question about InDevMined post.'
}
