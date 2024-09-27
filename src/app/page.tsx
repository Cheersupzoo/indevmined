import Layout from '@/components/Layout'
import Question from '@/components/Question'
import StuntingBackground from '@/components/StuntingBackground'
import { Metadata } from 'next'
import Link from 'next/link'

export default function Home() {
  return (
    <Layout>
      <div className='text-text relative mx-auto max-w-2xl w-full text-lg'>
        <Question />
        <div className='text-sm text-center text-zinc-500 mt-2'>
          AI can make mistakes. Check important info.
        </div>
        <div className='text-sm text-center text-zinc-500 mt-2 mb-8'>
          Made for fun with{' '}
          <a className='text-text' href='https://nextjs.org' target='_blank'>
            Next.js
          </a>{' '}
          +{' '}
          <a
            className='text-text'
            href='https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/MODEL_CARD.md'
            target='_blank'
          >
            Llama 3.1
          </a>{' '}
          70b on{' '}
          <a className='text-text' href='https://groq.com' target='_blank'>
            Groq
          </a>
        </div>
      </div>

      <div className='text-text relative mx-auto max-w-2xl w-full text-lg'>
        <Link className='font-medium' href={'/post'}>Read Posts Yourself?</Link>
      </div>
      <StuntingBackground />
    </Layout>
  )
}

export const metadata: Metadata = {
  title: 'Home | In Dev Mined',
  description:
    'All In Dev Mined Home page. Ask AI question about InDevMined post.'
}
