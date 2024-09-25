import { ParsedEvent } from 'eventsource-parser'

type TextStreamUpdate = {
  done: boolean
  value: string
  citations?: any
  error?: any
  usage?: ResponseUsage
}

type ResponseUsage = {
  /** Including images and tools if any */
  prompt_tokens: number
  /** The tokens generated */
  completion_tokens: number
  /** Sum of the above two fields */
  total_tokens: number
}

export async function* openAIStreamToIterator(
  reader: ReadableStreamDefaultReader<ParsedEvent>
): AsyncGenerator<TextStreamUpdate> {
  while (true) {
    const { value, done } = await reader.read()
    if (done) {
      yield { done: true, value: '' }
      break
    }
    if (!value) {
      continue
    }
    const data = value.data
    if (data.startsWith('[DONE]')) {
      yield { done: true, value: '' }
      break
    }

    try {
      const parsedData = JSON.parse(data)

      if (parsedData.error) {
        yield { done: true, value: '', error: parsedData.error }
        break
      }

      if (parsedData.citations) {
        yield { done: false, value: '', citations: parsedData.citations }
        continue
      }

      yield {
        done: false,
        value: parsedData.choices?.[0]?.delta?.content ?? '',
        usage: parsedData.usage
      }
    } catch (e) {
      console.error('Error extracting delta from SSE event:', e)
    }
  }
}
