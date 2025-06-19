/* eslint-disable @next/next/no-img-element */
import { Metadata } from 'next'

import Layout, { NormalResponsive } from '@/components/Layout'
import MathQuestion from '@/components/MathQuestion'

import EnhancedMathBackground from './MathBackground'
import './style.css'

export default function Home() {
  return (
    <Layout isEN className='bg-slate-200 text-slate-800'>
      <div className='fixed inset-0 -z-10 bg-slate-200' />
      <EnhancedMathBackground />
      <NormalResponsive className='overflow-hidden pb-4 sm:overflow-visible'>
        <div className='relative flex'>
          <div>
            <div className='mt-4 text-xl font-thin text-amber-700 sm:text-3xl'>
              <span className='bg-gradient rounded-xl p-1 text-2xl text-slate-50 sm:text-4xl'>
                Mark
              </span>{' '}
              - The Mathematician AI
            </div>
            <div className='mb-4 mt-4 text-sm text-slate-800'>
              Mark is exceptional at calculations and counting. As a Generative
              AI enhanced with a code interpreter, he can leverage programming
              skills to overcome limitations that probability alone cannot
              address. Why not put his abilities to the test?
            </div>
          </div>
          <div className='h-[12rem] w-[27rem] sm:w-[20rem]' />
          <img
            className='absolute -right-10 top-4 w-[150px] sm:-right-16 sm:w-[250px]'
            src='/mark.png'
            alt='Mark the mathematician ai'
          />
        </div>
        <div className='relative rounded-3xl bg-slate-50/70 p-2 shadow-lg'>
          <MathQuestion />
          <div className='mt-2 text-center text-sm text-zinc-500'>
            Mark remains still far from perfection. Check important info.
          </div>
          <div className='mt-2 text-center text-sm text-zinc-500'>
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
        <div className='mt-8 flex justify-center'>
          <a
            href='https://github.com/Cheersupzoo/indevmined'
            className='text-sm text-slate-600 hover:underline'
          >
            View on GitHub
          </a>
        </div>
      </NormalResponsive>
    </Layout>
  )
}

export const metadata: Metadata = {
  title: 'AI Mark | In Dev Mined',
  description:
    'All In Dev Mined Home page. Ask AI question about InDevMined post.',
}
