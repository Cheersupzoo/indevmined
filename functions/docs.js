export { onRequestOptions } from '../src/utils/function/index'

import { getHeader } from '../src/utils/function/index'
/**
 * @typedef { {} } Env
 * @typedef { import('@cloudflare/workers-types').EventContext<Env, '',{}> } Context
 */
/** @param {Context} context */
export const onRequest = async (context) => {
  const res = await fetch(
    `https://${context.env.TIP_TAP_APP_ID}.collab.tiptap.cloud/api/documents`,
    {
      headers: {
        Authorization: context.env.TIP_TAP_API_SECRET
      }
    }
  )
  const docs = await res.json()

  const headers = getHeader(context)

  return Response.json({ docs }, { headers })
}
