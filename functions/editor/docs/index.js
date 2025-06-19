import { getHeader } from '../../../src/utils/function/index'
import { protectedRoute } from '../../../src/utils/function/protectedRoute'

export { onRequestOptions } from '../../../src/utils/function/index'

export const onRequestGet = protectedRoute(async (context) => {
  const res = await fetch(
    `https://${context.env.TIP_TAP_APP_ID}.collab.tiptap.cloud/api/documents`,
    {
      headers: {
        Authorization: context.env.TIP_TAP_API_SECRET,
      },
    }
  )
  const docs = await res.json()

  const headers = getHeader(context)

  return Response.json(
    {
      docs: docs.map((doc) => ({ ...doc, name: doc.name })),
    },
    { headers }
  )
})

export const onRequestPost = protectedRoute(async (context, tokenPayload) => {
  const newDocumentId = `${tokenPayload.email}/${crypto
    .randomUUID()
    .slice(0, 5)}/`
  const res = await fetch(
    `https://${
      context.env.TIP_TAP_APP_ID
    }.collab.tiptap.cloud/api/documents/${encodeURIComponent(
      newDocumentId
    )}?format=json`,
    {
      headers: {
        Authorization: context.env.TIP_TAP_API_SECRET,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'This is your content.',
              },
            ],
          },
        ],
      }),
    }
  )

  const headers = getHeader(context)
  return Response.json({ status: 'success', id: newDocumentId }, { headers })
})
