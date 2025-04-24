'use client'

import { getEditorToken } from '@/apis/editor'
import {
  onSyncedParameters,
  TiptapCollabProvider,
  WebSocketStatus
} from '@hocuspocus/provider'
import { useEffectOnce } from '@legendapp/state/react'
import { useCallback, useRef } from 'react'
import { type Doc } from 'yjs'
import { useEditorContext } from './EditorProvider'

export const useTiptapProvider = (
  docId: string,
  ydoc: Doc,
  onSynced: (event: onSyncedParameters) => void
) => {
  const { status$ } = useEditorContext()

  const refreshProvider = useCallback(async () => {
    try {
      const token = await getEditorToken()
      if (!process.env.NEXT_PUBLIC_TIP_TAP_APP_ID) {
        return new Error('Missing Tiptap app id')
      }

      const provider = new TiptapCollabProvider({
        name: docId, // Unique document identifier for syncing. This is your document name.
        appId: process.env.NEXT_PUBLIC_TIP_TAP_APP_ID, // Your Cloud Dashboard AppID or `baseURL` for on-premises
        token,
        document: ydoc,
        onSynced,
        onStatus: (data) => {
          if (data.status === WebSocketStatus.Connecting) {
            status$.set('Connecting')
          } else if (data.status === WebSocketStatus.Connected) {
            status$.set('Connected')
          }
        },
        preserveConnection: false
      })

      const offlineListener = () => {
        if (docId) {
          status$.set('Offline')
        }
      }
      window.addEventListener('offline', offlineListener)

      const onlineListener = () => {
        if (docId && provider.isConnected) {
          status$.set('Connected')
        }
      }

      window.addEventListener('online', onlineListener)

      return () => {
        provider.destroy()
        window.removeEventListener('offline', offlineListener)
        window.removeEventListener('online', onlineListener)
      }
    } catch (e) {
      console.error(e)
    }
  }, [docId])

  useEffectOnce(() => {
    const promise = refreshProvider()

    return () => {
      promise.then((destroy) => typeof destroy === 'function' && destroy())
    }
  }, [docId])

  return { refreshProvider }
}
