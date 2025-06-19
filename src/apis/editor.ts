import { TiptapDoc } from '@/app/editor/hooks/EditorProvider'
import { fetchAwareOnline } from '@/utils/Network/fetch'
import { getAuth } from 'firebase/auth'

import { UploadFunction } from '@/components/tiptap-node/image-upload-node'

export const getDocs = async () => {
  const token = await getAuth().currentUser?.getIdToken()
  const res = await fetchAwareOnline(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT ?? ''}/editor/docs`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
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
  const res = await fetchAwareOnline(
    process.env.NEXT_PUBLIC_AUTH_ENDPOINT ?? '/editor/auth',
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
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

export const updateDoc = async (id: string, newId: string) => {
  const token = await getAuth().currentUser?.getIdToken()
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_SERVER_ENDPOINT ?? ''
    }/editor/docs/${encodeURIComponent(id)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'PUT',
      body: JSON.stringify({ id: newId }),
    }
  )
  if (res.status !== 204) {
    throw new Error('Fail to update docs')
  }

  return
}

export const deleteDoc = async (id: string) => {
  const token = await getAuth().currentUser?.getIdToken()
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_SERVER_ENDPOINT ?? ''
    }/editor/docs/${encodeURIComponent(id)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'DELETE',
    }
  )
  if (res.status !== 200) {
    throw new Error('Fail to delete docs')
  }

  const data = await res.json()

  return data
}

export const handleImageUpload: UploadFunction = async (
  file,
  onProgress,
  abortSignal
) => {
  const formData = new FormData()
  formData.append('image', file)
  const token = await getAuth().currentUser?.getIdToken()

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    abortSignal?.addEventListener('abort', () => {
      xhr.abort()
    })
    xhr.open(
      'POST',
      `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT ?? ''}/editor/image`
    )
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        onProgress?.({ progress: Math.ceil((e.loaded / e.total) * 100) })
      }
    })
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText)
        resolve(data.url)
      } else {
        const error = xhr.responseText
        reject(error)
      }
    })
    xhr.addEventListener('error', () => {
      reject('Upload failed')
    })
    xhr.send(formData)
  })
}

export const deleteImage = async (key: string) => {
  const token = await getAuth().currentUser?.getIdToken()
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_SERVER_ENDPOINT ?? ''
    }/editor/image/${encodeURIComponent(key)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'DELETE',
    }
  )

  if (res.status !== 204) {
    throw new Error('Fail to delete image')
  }

  return
}
