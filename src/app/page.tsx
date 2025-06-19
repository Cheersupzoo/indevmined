/* eslint-disable @next/next/no-img-element */
import { Metadata } from 'next'
import Link from 'next/link'

import Layout, { NormalResponsive } from '@/components/Layout'
import Question from '@/components/Question'
import StuntingBackground from '@/components/StuntingBackground'

export default function Home() {
  return (
    <Layout isEN>
      <NormalResponsive>
        <div className='relative flex'>
          <div className='h-40 w-64' />
          <div className='mt-2 space-y-4 sm:mt-10'>
            <div className='text-xl sm:text-2xl'>
              Ask <span className='font-semibold text-color2'>Ham</span> the AI
              about <span className='font-medium text-color1'>InDevMined</span>!
            </div>
            <div className='text-sm sm:text-base'>
              He knows all the FB posts and can respond in both English and
              Thai.
            </div>
          </div>
          <img
            className='absolute -left-16 top-0 w-[200px] sm:w-[300px]'
            src='/ham.png'
            alt='Ham the ai assistance'
          />
        </div>
        <div className='rounded-3xl bg-foreground/90 p-2'>
          <Question />
          <div className='mt-2 text-center text-sm text-zinc-500'>
            AI can make mistakes. Check important info.
          </div>
          <div className='mb-8 mt-2 text-center text-sm text-zinc-500'>
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

          <div className='px-4 py-2'>
            <div className='mb-4 text-2xl font-medium'>Q&A</div>

            <div className='mb-2 font-medium'>What is Ham?</div>
            <div className='text-justify text-sm'>
              This is a Q&A AI system that has been trained using information
              from the{' '}
              <a
                className='underline underline-offset-4 hover:text-color2'
                href='https://www.facebook.com/profile.php?id=61558639690052'
              >
                In Dev Mined Facebook Page
              </a>
              . The AI will respond based on the language of the question.
              Currently, the AI supports only English and Thai. While it is
              possible to ask questions in other languages, the results may not
              be accurate.
            </div>

            <div className='mb-2 mt-4 font-medium'>How is Ham made?</div>
            <div className='text-justify text-sm'>
              The core of this AI system is based on the LLM{' '}
              <a
                className='underline underline-offset-4 hover:text-color2'
                href='https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/MODEL_CARD.md'
                target='_blank'
              >
                Llama 3.1 70B
              </a>{' '}
              model, utilizing a RAG (Retrieval-Augmented Generation) approach
              to provide specific information within a given context. The
              process begins by determining the language of the question using
              the{' '}
              <a
                className='underline underline-offset-4 hover:text-color2'
                href='https://github.com/wooorm/franc'
                target='_blank'
              >
                franc
              </a>{' '}
              library. Then, relevant information in the same language is
              retrieved to establish context. After constructing the prompt, it
              is fed into the LLM Llama 3.1 model, and the generated answer is
              streamed to the client.
            </div>
            <div className='mb-2 mt-4 font-medium'>
              Where can I read the information that AI acquires?
            </div>
            <div className='text-justify text-sm'>
              The information is provided as posts in Thai on the{' '}
              <a
                className='underline underline-offset-4 hover:text-color2'
                href='https://www.facebook.com/profile.php?id=61558639690052'
              >
                In Dev Mined Facebook Page
              </a>{' '}
              or on{' '}
              <Link
                className='underline underline-offset-4 hover:text-color2'
                href={'/post'}
              >
                this website
              </Link>
              . An English translated version is available on this{' '}
              <Link
                className='underline underline-offset-4 hover:text-color2'
                href={'/en/post'}
              >
                page
              </Link>
              .
            </div>
          </div>
        </div>
        <div className='mt-8 flex justify-center'>
          <a
            href='https://github.com/Cheersupzoo/indevmined'
            className='text-sm hover:underline'
          >
            View on GitHub
          </a>
        </div>
      </NormalResponsive>
      <StuntingBackground />
    </Layout>
  )
}

export const metadata: Metadata = {
  title: 'Home | In Dev Mined',
  description:
    'All In Dev Mined Home page. Ask AI question about InDevMined post.',
}
