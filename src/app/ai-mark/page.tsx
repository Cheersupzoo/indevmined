/* eslint-disable @next/next/no-img-element */
import Layout, { NormalResponsive } from '@/components/Layout'
import MathQuestion from '@/components/MathQuestion'
import { Metadata } from 'next'
import EnhancedMathBackground from './MathBackground'
import './style.css'

export default function Home() {
  return (
    <Layout className='bg-slate-200 text-slate-800'>
      <div className='-z-10 fixed inset-0 bg-slate-200' />
      <EnhancedMathBackground />
      <NormalResponsive className='overflow-hidden sm:overflow-visible pb-4'>
        <div className='relative flex '>
          <div>
            <div className='mt-4 text-xl sm:text-3xl font-thin text-amber-700'>
              <span className='text-2xl sm:text-4xl bg-gradient p-1 rounded-xl text-slate-50 '>
                Mark
              </span>{' '}
              - The Mathematician AI
            </div>
            <div className='mt-4 mb-4 text-sm text-slate-800'>
              Mark is exceptional at calculations and counting. As a Generative
              AI enhanced with a code interpreter, he can leverage programming
              skills to overcome limitations that probability alone cannot
              address. Why not put his abilities to the test?
            </div>
          </div>
          <div className='w-[27rem] sm:w-[20rem] h-[12rem]' />
          <img
            className='absolute top-4 -right-10 sm:-right-16 w-[150px] sm:w-[250px]'
            src='/mark.png'
            alt='Mark the mathematician ai'
          />
        </div>
        <div className='bg-slate-50/70 shadow-lg p-2 rounded-3xl relative'>
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