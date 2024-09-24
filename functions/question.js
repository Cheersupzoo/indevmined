// @ts-check
import { franc } from 'franc-min'
import { knowledge } from '../script/knowledge'
/**
 * @typedef { {GROQ_API_KEY: string} } Env
 */
/**
 * @param {import('@cloudflare/workers-types').EventContext<Env, '',{}>} context
 */
export const onRequest = async (context) => {
  const reqBody = await context.request.json().catch((e) => {
    console.trace(e)

    return 'error'
  })
  if(reqBody === 'error') {
    return Response.json({ status: 'failed', error: 'Invalid content-type.' })
  }

  if (!reqBody?.question || typeof reqBody?.question !== 'string') {
    return Response.json({ status: 'failed', error: 'Invalid parameters.' })
  }

  if (reqBody.question.length > 400) {
    return Response.json({ status: 'failed', error: 'Question too long.' })
  }
  const question = reqBody?.question

  let lang = franc(question, { only: ['tha', 'eng'] })
  if (lang === 'und') lang = 'eng'

  const url = 'https://api.groq.com/openai/v1/chat/completions'
  const apiKey = context.env.GROQ_API_KEY
  let systemPrompt = `You are a very enthusiastic InDevMined representative who loves to help people! Given the following information provided inside <POST> tags, answer the question using only that information, outputted in markdown format. It is okay to provide additional information based on the information given. If you are unsure and the answer is not explicitly written in the information, say "Sorry, I don't know how to help with that."
  
  Context sections:
    `
  systemPrompt += knowledge[lang]
  systemPrompt += `
    Answer as markdown:`
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
    model: 'llama-3.1-70b-versatile',
    temperature: 0.1,
    max_tokens: 1500,
    top_p: 1,
    stream: reqBody.stream ?? false,
    stop: null
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  })

  return new Response(response.body, response)
}
