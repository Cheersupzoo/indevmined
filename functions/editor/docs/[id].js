export { onRequestOptions } from '../../../src/utils/function/index'
import { getHeader } from '../../../src/utils/function/index'
import { protectedRoute } from '../../../src/utils/function/protectedRoute'

export const onRequestDelete = protectedRoute(async (context, tokenPayload) => {
  const id = context.params['id']
  const decodedId = decodeURIComponent(id)
  const headers = getHeader(context)

  if (!decodedId.startsWith(tokenPayload.email)) {
    return Response.json(
      { status: 'Unauthorized', message: 'Unauthorized to delete' },
      { headers, status: 401 }
    )
  }

  const res = await fetch(
    `https://${context.env.TIP_TAP_APP_ID}.collab.tiptap.cloud/api/documents/${id}`,
    {
      headers: {
        Authorization: context.env.TIP_TAP_API_SECRET,
        'Content-Type': 'application/json'
      },
      method: 'DELETE'
    }
  )

  if (res.status !== 204) {
    return Response.json({ status: 'error' }, { headers, status: 400 })
  }

  return Response.json({ status: 'success' }, { headers })
})
