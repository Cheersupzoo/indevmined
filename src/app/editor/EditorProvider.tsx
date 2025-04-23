'use client'

import React, { createContext, useContext } from 'react'
import { useEffectOnce, useObservable } from '@legendapp/state/react'
import { Observable } from '@legendapp/state'
import { getDocs } from '@/apis/editor'

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

  useEffectOnce(() => {
    const init = async () => {
      try {
        const data = await getDocs()
        if (data.docs) {
          docs$.set(data.docs)
        }
      } catch (e) {
        console.error(e)
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
