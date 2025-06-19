import { getHeader } from '../../../src/utils/function/index'
import { protectedRoute } from '../../../src/utils/function/protectedRoute'

export { onRequestOptions } from '../../../src/utils/function/index'

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
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    }
  )

  if (res.status !== 204) {
    return Response.json({ status: 'error' }, { headers, status: 400 })
  }

  return Response.json({ status: 'success' }, { headers })
})

export const onRequestPut = protectedRoute(async (context, tokenPayload) => {
  const encodedId = context.params['id']
  const decodedId = decodeURIComponent(encodedId)
  const headers = getHeader(context)

  if (!decodedId.startsWith(tokenPayload.email)) {
    return Response.json(
      { status: 'Unauthorized', message: 'Unauthorized to update' },
      { headers, status: 401 }
    )
  }

  const { id: newId } = await context.request.json()

  if (!newId) {
    return Response.json(
      { status: 'User Error', message: 'Missing id' },
      { headers, status: 400 }
    )
  }

  const [email, key] = decodedId.split('/')
  const [newEmail, newKey] = newId.split('/')
  if (!(email === newEmail && key === newKey)) {
    return Response.json(
      { status: 'User Error', message: 'Mismatch user or key' },
      { headers, status: 400 }
    )
  }

  const docRes = await fetch(
    `https://${context.env.TIP_TAP_APP_ID}.collab.tiptap.cloud/api/documents/${encodedId}?format=yjs`,
    {
      headers: {
        Authorization: context.env.TIP_TAP_API_SECRET,
      },
    }
  )

  if (docRes.status !== 200) {
    return Response.json({ status: 'Error' }, { headers, status: 500 })
  }

  const doc = await docRes.bytes()

  const encodedNewId = encodeURIComponent(newId)
  const [createRes, deleteRes] = await Promise.all([
    fetch(
      `https://${context.env.TIP_TAP_APP_ID}.collab.tiptap.cloud/api/documents/${encodedNewId}`,
      {
        headers: {
          Authorization: context.env.TIP_TAP_API_SECRET,
        },
        method: 'POST',
        body: doc,
      }
    ),
    fetch(
      `https://${context.env.TIP_TAP_APP_ID}.collab.tiptap.cloud/api/documents/${encodedId}`,
      {
        headers: {
          Authorization: context.env.TIP_TAP_API_SECRET,
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      }
    ),
  ])

  if (createRes.status !== 204) {
    const createText = await createRes.text()
    console.error('createRes', createText)
  }

  if (deleteRes.status !== 204) {
    const deleteText = await deleteRes.text()
    console.error('deleteRes', deleteText)
  }

  return new Response(null, { headers, status: 204 })
})
