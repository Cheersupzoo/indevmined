// @ts-check
import { franc } from 'franc-min'
import {
  knowledge,
  postMeta,
  numberOfPost,
  latestPostTitle,
  titleSlugMap
} from '../script/knowledge'
import { functionWrapper } from '../src/utils/function'
const dontKnowPrompt = {
  eng: `Sorry, I don't know how to help with that.`,
  tha: 'ขออภัย ฉันไม่สามารถตอบคำถามดังกล่าวได้'
}

export const onRequest = functionWrapper(async (context, reqBody) => {
  let lang = franc(reqBody.question, { only: ['tha', 'eng'] })
  if (lang === 'und') lang = 'eng'

  const url = 'https://api.together.xyz/v1/chat/completions'
  const togetherAIApiKey = context.env.TOGETHER_AI_API_KEY

  const systemRetrievalPrompt = `You will be provided with all the post metadata of InDevMinded Page. The user will ask question relate to InDevMinedPage. You will have to identify from all of the post metadata, provided in <POST_META> tag, and pick 4 most related post related to user's question. \n\n${postMeta[lang]}\n\nMake sure to provide answer in format of array of string of post's slug. 
<example>
For example when related post's meta is 
<POST_META>
  slug: Short-term-Memory-of-Gen-AI
  title: Short-term Memory of Gen AI
language-th-link: "[[ความจำระยะสั้น-ของ-Gen-AI]]"
extracted: '{  "summarize": "Improve Gen AI accuracy by attaching relevant documents and instructing it to use only that knowledge to answer. This method enhances accuracy but slows down response time. Try it for specialized questions and adjust your asking method for better results.",  "keywords": ["Gen AI", "accuracy", "documents", "knowledge", "Q&A", "response time", "specialized questions"]}'
</POST_META>

  Answer should be
  
<ANSWER>["Short-term-Memory-of-Gen-AI"]</ANSWER>. 
</example>
  Do not provide any explanation.`

  const retrievalBody = {
    messages: [
      {
        role: 'system',
        content: systemRetrievalPrompt
      },
      {
        role: 'user',
        content: reqBody.question
      }
    ],
    model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    temperature: 0.1,
    max_tokens: 1500,
    top_p: 1,
    stream: false,
    stop: null
  }

  const retrievalResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${togetherAIApiKey}`
    },
    body: JSON.stringify(retrievalBody)
  })
  const retrievalResponseBody = await retrievalResponse.json()

  const retrievalSlugsText =
    retrievalResponseBody?.choices?.[0]?.message?.content

  const retrievalSlugs = JSON.parse(
    `[${retrievalSlugsText.split('[')?.[1].split(']')[0]}]`
  )

  const pageInformation = `\n\nThe general information relate to InDevMined Page is located in <indevmined_info> tag. <indevmined_info>InDevMined Page opened on 25 April 2024. The page owner is Cheer. Currently, there are ${numberOfPost} posts and the latest post title is ${latestPostTitle}.</indevmined_info>\n\n`
  let systemPrompt = `Your name is Ham. You are a very enthusiastic InDevMined representative who loves to help people! ${pageInformation} Given the following information provided inside <POST> tags, answer the question using only that information, outputted in markdown format. It is okay to provide additional information based on the information given. If you are unsure and the answer is not explicitly written in the information, say "${dontKnowPrompt[lang]}"
  
  Context sections:
    `
  systemPrompt += retrievalSlugs.map(
    (slug) =>
      `<POST>${knowledge[slug] ?? knowledge[titleSlugMap[slug]]}</POST>\n\n`
  )
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
    model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    temperature: 0.1,
    max_tokens: 1500,
    top_p: 1,
    stream: reqBody.stream ?? false,
    stop: null
  }
  const response = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${togetherAIApiKey}`
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

export { onRequestOptions } from '../src/utils/function/index'
