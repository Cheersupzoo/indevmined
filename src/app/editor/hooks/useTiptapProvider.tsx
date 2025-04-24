'use client'

import { getEditorToken } from '@/apis/editor'
import { TiptapCollabProvider, WebSocketStatus } from '@hocuspocus/provider'
import type { Observable, ObservableBoolean } from '@legendapp/state'
import { type Doc } from 'yjs'
import { EditorStatus } from './EditorProvider'
import { useRef } from 'react'

export const useTiptapProvider = ({
  docId$,
  status$,
  syncing$,
  ydoc$
}: {
  docId$: Observable<string | null>
  ydoc$: Observable<Doc>
  syncing$: ObservableBoolean
  status$: EditorStatus
}) => {
  const unsubscribeRef = useRef<Promise<() => void>[]>([])
  const createTiptapProviderAsync = async () => {
    const docId = docId$.peek()
    const ydoc = ydoc$.peek()

    if (!docId) {
      return () => {}
    }
    try {
      const token = await getEditorToken()
      if (!process.env.NEXT_PUBLIC_TIP_TAP_APP_ID) {
        console.error('Missing Tiptap app id')
        return () => {}
      }

      const provider = new TiptapCollabProvider({
        name: docId, // Unique document identifier for syncing. This is your document name.
        appId: process.env.NEXT_PUBLIC_TIP_TAP_APP_ID, // Your Cloud Dashboard AppID or `baseURL` for on-premises
        token,
        document: ydoc,
        onSynced: (event) => {
          if (syncing$.peek() && event.state) {
            syncing$.set(false)
          }
        },
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
      return () => {}
    }
  }

  const destroyProvider = () => {
    const toUnsub = unsubscribeRef.current.length
    if (toUnsub) {
      for (let i = 0; i < toUnsub; i++) {
        unsubscribeRef.current.pop()?.then((unSub) => {
          unSub()
        })
      }
    }
  }

  /**
   * @description Destroy previous provider if exist and create new provider
   */
  const createTiptapProvider = () => {
    destroyProvider()
    unsubscribeRef.current.push(createTiptapProviderAsync())
  }

  return { createTiptapProvider, destroyProvider }
}
