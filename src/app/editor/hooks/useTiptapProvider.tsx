'use client'

import { getEditorToken } from '@/apis/editor'
import { onSyncedParameters, TiptapCollabProvider } from '@hocuspocus/provider'
import { useCallback, useEffect, useRef } from 'react'
import { type Doc } from 'yjs'

export const useTiptapProvider = (
  docId: string,
  ydoc: Doc,
  onSynced: (event: onSyncedParameters) => void
) => {
  const provider = useRef<TiptapCollabProvider>()

  const refreshProvider = useCallback(async () => {
    try {
      const token = await getEditorToken()
      if (!process.env.NEXT_PUBLIC_TIP_TAP_APP_ID) {
        return new Error('Missing Tiptap app id')
      }
      if (provider.current) {
        provider.current.disconnect()
        provider.current.destroy()
      }
      provider.current = new TiptapCollabProvider({
        name: docId, // Unique document identifier for syncing. This is your document name.
        appId: process.env.NEXT_PUBLIC_TIP_TAP_APP_ID, // Your Cloud Dashboard AppID or `baseURL` for on-premises
        token,
        document: ydoc,
        onSynced
      })
    } catch (e) {
      console.error(e)
    }
  }, [docId, ydoc])

  useEffect(() => {
    refreshProvider()

    return () => {
      if (provider.current) {
        provider.current?.disconnect()
        provider.current?.destroy()
      }
    }
  }, [docId, ydoc])

  return { refreshProvider }
}
