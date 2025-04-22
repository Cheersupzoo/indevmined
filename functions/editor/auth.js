export { onRequestOptions } from '../../src/utils/function/index'

import { protectedRoute } from '../../src/utils/function/protectedRoute'
import { getHeader } from '../../src/utils/function/index'
import { SignJWT } from 'jose'

/**
 * @typedef { {GROQ_API_KEY: string, E2B_API_KEY: string, TOGETHER_AI_API_KEY: string, TIP_TAP_APP_SECRET: string} } Env
 * @typedef { import('@cloudflare/workers-types').EventContext<Env, '',{}> } Context
 */
/** @param {Context} context */
export const onRequest = protectedRoute(async (context, tokenPayload) => {
  const data = {
    sub: tokenPayload.email,
    allowedDocumentNames: ['example-document']
  }
  const secret = new TextEncoder().encode(context.env.TIP_TAP_APP_SECRET)

  const jwt = await new SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .setIssuer('indevmined-editor-auth')
    .sign(secret)

  const headers = getHeader(context)
  return Response.json({ token: jwt }, { headers })
})
