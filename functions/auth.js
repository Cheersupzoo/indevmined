export { onRequestOptions } from '../src/utils/function/index'

import { getHeader } from '../src/utils/function/index'
import jsonwebtoken from '@tsndr/cloudflare-worker-jwt'

/**
 * @typedef { {GROQ_API_KEY: string, E2B_API_KEY: string, TOGETHER_AI_API_KEY: string, TIP_TAP_APP_SECRET: string} } Env
 * @typedef { import('@cloudflare/workers-types').EventContext<Env, '',{}> } Context
 */
/** @param {Context} context */
export const onRequest = async (context) => {
  const data = {
    sub: 'guest',
    allowedDocumentNames: ['example-document']
  }

  const jwt = await jsonwebtoken.sign(data, context.env.TIP_TAP_APP_SECRET, {
    expiresIn: '1h'
  })
  const headers = getHeader(context)

  return Response.json({ token: jwt }, { headers })
}
