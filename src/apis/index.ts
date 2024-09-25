import { openAIStreamToIterator } from '@/utils/Stream'
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
