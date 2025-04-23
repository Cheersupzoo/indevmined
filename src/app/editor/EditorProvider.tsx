'use client'

import React, { createContext, useContext } from 'react'
import { useEffectOnce, useObservable } from '@legendapp/state/react'
import {
  Observable,
  ObservableHint,
  observe,
  OpaqueObject
} from '@legendapp/state'
import { getDocs, createDoc as createDocApi } from '@/apis/editor'
import * as Y from 'yjs'

export type TiptapDoc = {
  created_at: string
  name: string
  size: number
  updated_at: string
}

const EditorContext = createContext<{
  docs$: Observable<TiptapDoc[] | null>
  docId$: Observable<string | null>
  createDoc: () => void
  ydoc$: Observable<OpaqueObject<Y.Doc>>
}>(undefined as any)

const EditorProvider = ({ children }: React.PropsWithChildren) => {
  const docs$ = useObservable<TiptapDoc[] | null>(null)
  const docId$ = useObservable<string | null>(null)
  const ydoc$ = useObservable(ObservableHint.opaque(new Y.Doc()))

  observe(docId$, () => {
    ydoc$.set(ObservableHint.opaque(new Y.Doc()))
  })

  const loadDocs = async () => {
    try {
      const data = await getDocs()
      if (data.docs) {
        docs$.set(data.docs)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffectOnce(() => {
    loadDocs()
  }, [])

  const createDoc = async () => {
    try {
      const data = await createDocApi()
      await loadDocs()
      docId$.set(data.id)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <EditorContext.Provider value={{ docs$, docId$, createDoc, ydoc$ }}>
      {children}
    </EditorContext.Provider>
  )
}

export default EditorProvider

export const useEditorContext = () => useContext(EditorContext)
