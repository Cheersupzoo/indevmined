import { ParsedEvent } from 'eventsource-parser'

export type TextStreamUpdate = {
  done: boolean
  value: string
  citations?: any
  error?: any
  usage?: ResponseUsage
  codeId?: string
  code?: string
  id?: string
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

      if (parsedData.object === 'code.execute') {
        yield {
          id: parsedData.id,
          done: false,
          value: 'Executing Python Code'
        }
      }

      if (parsedData.object === 'code.source') {
        yield {
          id: parsedData.id,
          done: false,
          value: '',
          codeId: parsedData.id,
          code: parsedData.code
        }
      }

      if (parsedData.object === 'code.source.result') {
        yield {
          id: parsedData.id,
          done: false,
          value: parsedData.result,
          codeId: parsedData.id,
          error: parsedData.error
        }
      }

      yield {
        done: false,
        id: parsedData.id,
        value: parsedData.choices?.[0]?.delta?.content ?? '',
        usage: parsedData.usage
      }
    } catch (e) {
      console.error(data)
      console.error('Error extracting delta from SSE event:', e)
    }
  }
}
