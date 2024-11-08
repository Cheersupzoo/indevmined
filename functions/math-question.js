import { callE2B } from '../src/utils/function/e2b'
import { functionWrapper } from '../src/utils/function/index'
import { sendMessage } from '../src/utils/function/stream'

const codeParser = (functionObj) => {
  if (!functionObj?.function?.arguments || !functionObj?.id) {
    return {
      id: functionObj.id,
      error: 'Fail to execute function'
    }
  }

  return {
    id: functionObj.id,
    code: JSON.parse(functionObj.function.arguments).code
  }
}

export const onRequest = functionWrapper(async (context, reqBody) => {
  const url = 'https://api.groq.com/openai/v1/chat/completions'
  const groqApiKey = context.env.GROQ_API_KEY
  const e2bApiKey = context.env.E2B_API_KEY

  let systemPrompt = `You are Mark, a very enthusiastic InDevMined representative who loves to help people on math and logic! Your are task to create a python code snippet that will use for solving the user questions. When answering, do not include the code when provide answer to user.`
  const question = reqBody.question
  const body = {
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: question
      }
    ],
    model: 'llama3-groq-70b-8192-tool-use-preview',
    temperature: 0.1,
    max_tokens: 1500,
    stream: false,
    tools: [
      {
        type: 'function',
        function: {
          name: 'execute_python',
          description:
            'Execute python code in a Jupyter notebook cell and return result',
          parameters: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                description: 'The python code to execute in a single cell'
              }
            },
            required: ['code']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'unable_to_answer',
          description:
            'When question is not able to transform into python code will be handle by this function'
        }
      }
    ],
    tool_choice: 'auto'
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${groqApiKey}`
    },
    body: JSON.stringify(body)
  })

  const result = await response.json()
  const aiChoice = result?.choices?.[0]?.message

  if (aiChoice?.tool_calls) {
    if (
      aiChoice.tool_calls.some(
        (toolCall) => toolCall.function.name === 'unable_to_answer'
      )
    ) {
      return 'Sorry, I am unable to answer the following question.'
    }

    const { readable, writable } = new TransformStream()

    new Promise(async (resolve) => {
      try {
        const jsonText = JSON.stringify({
          object: 'code.execute',
          id: 'code.execute'
        })
        await sendMessage(jsonText, writable)

        for await (const toolCall of aiChoice.tool_calls) {
          const { id, code } = codeParser(toolCall)
          const jsonText = JSON.stringify({ object: 'code.source', id, code })
          await sendMessage(jsonText, writable)
        }
        const results = await Promise.all(
          aiChoice.tool_calls.map(async (toolCall) => {
            const { id, code, error } = codeParser(toolCall)

            if (error) {
              return {
                id,
                error
              }
            }

            const output = await callE2B(e2bApiKey, id, code)

            const jsonText = JSON.stringify({
              object: 'code.source.result',
              id,
              result: output.result,
              error: output.error
            })
            await sendMessage(jsonText, writable)

            return output
          })
        )

        const body = {
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: question
            },
            aiChoice,
            {
              role: 'function',
              name: 'execute_python',
              content: JSON.stringify(results)
            }
          ],
          model: 'llama-3.1-70b-versatile',
          temperature: 0.1,
          max_tokens: 1500,
          stream: reqBody.stream ?? false
        }
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqApiKey}`
          },
          body: JSON.stringify(body)
        })

        response.body.pipeTo(writable)
        resolve()
      } catch (error) {
        console.error(error)
        writable.close()
      }
    })

    return readable
  }

  return aiChoice.content
})

export { onRequestOptions } from '../src/utils/function/index'
