import Layout, { NormalResponsive } from '@/components/Layout'
import Question from '@/components/Question'
import StuntingBackground from '@/components/StuntingBackground'
import { Metadata } from 'next'
import Link from 'next/link'

export default function Home() {
  return (
    <Layout>
      <NormalResponsive>
        <div className='bg-foreground/90 p-2 rounded-3xl'>
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

          <div className='px-4 py-2'>
            <div className='font-medium text-2xl mb-4'>Q&A</div>

            <div className='font-medium mb-2'>What is this AI?</div>
            <div className='text-sm text-justify'>
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

            <div className='font-medium mb-2 mt-4'>How is this AI made?</div>
            <div className='text-sm text-justify'>
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
            <div className='font-medium mb-2 mt-4'>
              Where can I read the information that AI acquires?
            </div>
            <div className='text-sm text-justify'>
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
              . An English translated version is available on this <Link
                className='underline underline-offset-4 hover:text-color2'
                href={'/en/post'}
              >page</Link>.
            </div>
          </div>
        </div>
      </NormalResponsive>
      <StuntingBackground />
    </Layout>
  )
}

export const metadata: Metadata = {
  title: 'Home | In Dev Mined',
  description:
    'All In Dev Mined Home page. Ask AI question about InDevMined post.'
}
