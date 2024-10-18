// @ts-check
import { franc } from 'franc-min'
import { knowledge } from '../script/knowledge'
import { functionWrapper } from '../src/utils/function'
const dontKnowPrompt = {
  eng: `Sorry, I don't know how to help with that.`,
  tha: 'ขออภัย ฉันไม่สามารถตอบคำถามดังกล่าวได้'
}

/**
 * @typedef { {GROQ_API_KEY: string} } Env
 */
/**
 * @param {import('@cloudflare/workers-types').EventContext<Env, '',{}>} context
 */
export const onRequest = functionWrapper(async (context, reqBody) => {
  let lang = franc(reqBody.question, { only: ['tha', 'eng'] })
  if (lang === 'und') lang = 'eng'

  const url = 'https://api.groq.com/openai/v1/chat/completions'
  const apiKey = context.env.GROQ_API_KEY
  let systemPrompt = `You are a very enthusiastic InDevMined representative who loves to help people! Given the following information provided inside <POST> tags, answer the question using only that information, outputted in markdown format. It is okay to provide additional information based on the information given. If you are unsure and the answer is not explicitly written in the information, say "${dontKnowPrompt[lang]}"
  
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
        content: reqBody.question
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

  return response
})

function getHeader(context) {
  const origin = context.request.headers.get('origin') ?? ''

  const corsWhitelist = [
    /^http:\/\/localhost:3000/,
    /^https:\/\/[0-9a-z]+\.isekai-dev-guide\.pages\.dev/,
    /www\.indevmined\.com/,
    /indevmined\.com/
  ]

  if (corsWhitelist.some((whitelist) => whitelist.test(origin))) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Max-Age': '86400'
    }
  }

  return {
    'Access-Control-Allow-Origin': 'https://www.indevmined.com',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400'
  }
}

export const onRequestOptions = async (context) => {
  return new Response(null, {
    status: 204,
    headers: getHeader(context)
  })
}
