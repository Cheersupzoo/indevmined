/**
 * @typedef { {GROQ_API_KEY: string, E2B_API_KEY: string} } Env
 * @typedef { import('@cloudflare/workers-types').EventContext<Env, '',{}> } Context
 */
/**
 * @param {(context: Context,reqBody: {question: string; stream?: boolean}) => Promise<Response>} onRequest
 */
export const functionWrapper = (onRequest) => {
  /** @param {Context} context */
  return async (context) => {
    const headers = getHeader(context)
    const reqBody = await context.request.json().catch((e) => {
      console.trace(e)

      return 'error'
    })

    if (reqBody === 'error') {
      return Response.json(
        { status: 'failed', error: 'Invalid content-type.' },
        { headers }
      )
    }

    if (!reqBody?.question || typeof reqBody?.question !== 'string') {
      return Response.json(
        { status: 'failed', error: 'Invalid parameters.' },
        { headers }
      )
    }

    if (reqBody.question.length > 400) {
      return Response.json(
        { status: 'failed', error: 'Question too long.' },
        { headers }
      )
    }

    const response = await onRequest(context, reqBody)

    if (!(response instanceof Response)) {
      return Response.json(
        { data: response },
        {
          headers: {
            ...headers,
            'content-type': 'application/json'
          }
        }
      )
    }

    return new Response(response.body, {
      headers: {
        ...headers,
        'content-type': response.headers.get('content-type')
      }
    })
  }
}

export function getHeader(context) {
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
