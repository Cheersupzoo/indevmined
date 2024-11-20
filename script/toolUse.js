const { Sandbox } = require('@e2b/code-interpreter')

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

;(async () => {
  const url = 'https://api.groq.com/openai/v1/chat/completions'
  const apiKey = process.env.GROQ_API_KEY
  let systemPrompt = `You are a very enthusiastic InDevMined representative who loves to help people on math! Your are task to create a python code snippet that will use for solving the user question`
  const question =
    "Calculate how many r's are in the word 'strawberrry'. And what is 25*25=?'"
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
      }
    ],
    tool_choice: 'auto'
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  })

  const result = await response.json()
  const aiChoice = result?.choices?.[0]?.message
  if (aiChoice?.tool_calls) {
    const results = await Promise.all(
      aiChoice?.tool_calls.map(async (toolCall) => {
        const { id, code, error } = codeParser(toolCall)
        if (error) {
          return {
            id,
            error
          }
        }
        const sandbox = await Sandbox.create({
          apiKey: process.env.E2B_API_KEY
        })
        console.log(sandbox)

        const execution = await sandbox.runCode(code)

        const exeResult = execution.logs.stdout[0]

        return {
          id,
          result: exeResult
        }
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
      stream: false
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    })

    const output = await response.json()
    console.log(
      '🚀 Finally',
      JSON.stringify(output?.choices?.[0]?.message, null, 2)
    )
  }
})()
