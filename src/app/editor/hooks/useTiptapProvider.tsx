'use client'

import { getEditorToken } from '@/apis/editor'
import { TiptapCollabProvider, WebSocketStatus } from '@hocuspocus/provider'
import type { Observable, ObservableBoolean } from '@legendapp/state'
import { type Doc } from 'yjs'
import { EditorStatus } from './EditorProvider'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'

export const useTiptapProvider = ({
  docId$,
  status$,
  syncing$,
  ydoc$,
  updateIdRef,
  loadDocs
}: {
  docId$: Observable<string | null>
  ydoc$: Observable<Doc>
  syncing$: ObservableBoolean
  status$: EditorStatus
  updateIdRef: React.MutableRefObject<Promise<string> | null>
  loadDocs: () => Promise<void>
}) => {
  const router = useRouter()
  const unsubscribeRef = useRef<Promise<() => void>[]>([])
  const currentProviderRef = useRef<TiptapCollabProvider | null>(null)
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
        onDisconnect(data) {
          if (data.event.reason === 'Document deleted') {
            provider.destroy()
            loadDocs()
            if (updateIdRef.current) {
              updateIdRef.current.then((updateId) => {
                router.push('/editor?' + new URLSearchParams({ id: updateId }))
              })
              updateIdRef.current = null

              return
            }
            router.push('/editor')
          }
          if (data.event.reason === 'JWT verification failed') {
            status$.set('Disconnected')
            createTiptapProvider()
          }
        },
        onDestroy() {
          currentProviderRef.current = null
        },
        preserveConnection: false
      })
      currentProviderRef.current = provider

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

      const onVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          status$.set(provider.isConnected ? 'Connected' : 'Disconnected')
          if (provider.status === WebSocketStatus.Disconnected) {
            createTiptapProvider()
          }
        }
      }

      document.addEventListener('visibilitychange', onVisibilityChange)

      return () => {
        provider.destroy()
        window.removeEventListener('offline', offlineListener)
        window.removeEventListener('online', onlineListener)
        document.removeEventListener('visibilitychange', onVisibilityChange)
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

  const getCurrentProvider = () => currentProviderRef.current

  return { createTiptapProvider, destroyProvider, getCurrentProvider }
}
