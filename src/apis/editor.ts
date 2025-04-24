import { TiptapDoc } from '@/app/editor/EditorProvider'
import { getAuth } from 'firebase/auth'

export const getDocs = async () => {
  const token = await getAuth().currentUser?.getIdToken()
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT ?? ''}/editor/docs`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  if (res.status !== 200) {
    throw new Error('Fail to fetch docs')
  }

  const data = (await res.json()) as { docs: TiptapDoc[] }
  return data
}

export const createDoc = async () => {
  const token = await getAuth().currentUser?.getIdToken()
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT ?? ''}/editor/docs`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: 'POST'
    }
  )
  if (res.status !== 200) {
    throw new Error('Fail to create docs')
  }

  const data = await res.json()
  return data
}

export const getEditorToken = async () => {
  const auth = getAuth()
  const idToken = await auth.currentUser?.getIdToken()
  if (!idToken) {
    return
  }
  const res = await fetch(
    process.env.NEXT_PUBLIC_AUTH_ENDPOINT ?? '/editor/auth',
    {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    }
  )

  if (res.status !== 200) {
    throw new Error('[Auth] Unauthorized to use editor')
  }

  const { token } = await res.json()

  if (!token) {
    throw new Error('[Auth] Missing editor token')
  }

  return token as string
}

export const deleteDoc = async (id: string) => {
  const token = await getAuth().currentUser?.getIdToken()
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_SERVER_ENDPOINT ?? ''
    }/editor/docs/${encodeURIComponent(id)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: 'DELETE'
    }
  )
  console.log(res.status)
  if (res.status !== 200) {
    throw new Error('Fail to delete docs')
  }

  const data = await res.json()
  return data
}
