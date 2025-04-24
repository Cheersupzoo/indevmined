'use client'

import { getEditorToken } from '@/apis/editor'
import { onSyncedParameters, TiptapCollabProvider } from '@hocuspocus/provider'
import { useEffectOnce } from '@legendapp/state/react'
import { useCallback, useRef } from 'react'
import { type Doc } from 'yjs'

export const useTiptapProvider = (
  docId: string,
  ydoc: Doc,
  onSynced: (event: onSyncedParameters) => void
) => {
  const prev = useRef({ docId, ydocId: ydoc.guid })
  const providers = useRef<TiptapCollabProvider[]>([])

  const destroyAllProvider = () => {
    const totalProvider = providers.current.length

    if (!totalProvider) return
    for (let i = 0; i < totalProvider; i++) {
      const provider = providers.current.pop()
      provider!.destroy()
    }
  }

  const refreshProvider = useCallback(async () => {
    try {
      const token = await getEditorToken()
      if (!process.env.NEXT_PUBLIC_TIP_TAP_APP_ID) {
        return new Error('Missing Tiptap app id')
      }
      destroyAllProvider()
      providers.current.push(
        new TiptapCollabProvider({
          name: docId, // Unique document identifier for syncing. This is your document name.
          appId: process.env.NEXT_PUBLIC_TIP_TAP_APP_ID, // Your Cloud Dashboard AppID or `baseURL` for on-premises
          token,
          document: ydoc,
          onSynced,
          preserveConnection: false
        })
      )
    } catch (e) {
      console.error(e)
    }
  }, [docId, ydoc])

  useEffectOnce(() => {
    const promise = refreshProvider()

    return () => {
      destroyAllProvider()
      promise.then(() => destroyAllProvider())
    }
  }, [docId, ydoc])

  return { refreshProvider }
}
