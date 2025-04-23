'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { useEffectOnce, useObservable } from '@legendapp/state/react'
import { Observable } from '@legendapp/state'

export type TiptapDoc = {
  created_at: string
  name: string
  size: number
  updated_at: string
}

const EditorContext = createContext<{
  docs$: Observable<TiptapDoc[] | null>
  docId$: Observable<string | null>
}>(undefined as any)

const EditorProvider = ({ children }: React.PropsWithChildren) => {
  const docs$ = useObservable<TiptapDoc[] | null>(null)
  const docId$ = useObservable<string | null>(null)
  const { user$ } = useAuth()

  useEffectOnce(() => {
    const init = async () => {
      const token = await user$.peek()?.getIdToken?.()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT ?? ''}/editor/docs`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (res.status !== 200) {
        return
      }

      const data = await res.json()
      if (data.docs) {
        docs$.set(data.docs)
      }
    }
    init()
  }, [])

  return (
    <EditorContext.Provider value={{ docs$, docId$ }}>
      {children}
    </EditorContext.Provider>
  )
}

export default EditorProvider

export const useEditorContext = () => useContext(EditorContext)
