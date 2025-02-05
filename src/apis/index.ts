import { openAIStreamToIterator, TextStreamUpdate } from '@/utils/Stream'
import { EventSourceParserStream } from 'eventsource-parser/stream'

export const getAnswerIterator = async (question: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_QUESTION_ENDPOINT ?? '/question',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question,
        stream: true
      })
    }
  )
  if (response.status > 299) {
    throw new Error(`/question error ${response.status}`)
  }

  if (!response.body) {
    return
  }

  const eventStream = response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream())
  const reader = eventStream.getReader()
  const iterator = openAIStreamToIterator(reader)

  return iterator
}

export const getMathAnswerIterator: (
  question: string
) => Promise<AsyncGenerator<TextStreamUpdate, any, any>> = async (
  question: string
) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_MATH_QUESTION_ENDPOINT ?? '/math-question',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question,
        stream: true
      })
    }
  )
  if (response.status > 299) {
    throw new Error(`/question error ${response.status}`)
  }

  if (!response.body) {
    return
  }

  if (response.headers.get('content-type') === 'application/json') {
    const jsonBody = await response.json()

    return jsonBody.data
  }

  const eventStream = response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream())
  const reader = eventStream.getReader()
  const iterator = openAIStreamToIterator(reader)

  return iterator
}
