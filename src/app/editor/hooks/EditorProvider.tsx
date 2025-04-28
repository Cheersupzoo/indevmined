'use client'

import React, { createContext, useContext, useRef } from 'react'
import { useEffectOnce, useObservable } from '@legendapp/state/react'
import {
  type Observable,
  type ObservableBoolean,
  ObservableHint,
  type ObservablePrimitive,
  type OpaqueObject,
  batch
} from '@legendapp/state'
import {
  getDocs,
  createDoc as createDocApi,
  updateDoc as updateDocApi,
  deleteDoc as deleteDocApi
} from '@/apis/editor'
import * as Y from 'yjs'
import { Editor } from '@tiptap/core'
import { useTiptapProvider } from './useTiptapProvider'
import { type TiptapCollabProvider } from '@hocuspocus/provider'

export type TiptapDoc = {
  created_at: string
  name: string
  size: number
  updated_at: string
}

export type EditorStatus = ObservablePrimitive<
  'Connecting' | 'Offline' | 'Connected' | 'Disconnected' | null
>

const EditorContext = createContext<{
  docs$: Observable<TiptapDoc[] | null>
  docId$: Observable<string | null>
  editorDocId$: ObservablePrimitive<string | null>
  createDoc: () => void
  updateDoc: (id: string, input: { id: string }) => void
  deleteDoc: (id: string) => Promise<void>
  ydoc$: Observable<OpaqueObject<Y.Doc>>
  exportDoc: (type: 'json' | 'html' | 'yjs') => void
  currentEditor: React.MutableRefObject<Editor | null>
  status$: EditorStatus
  setDocId: (id: string | null) => void
  syncing$: ObservableBoolean
  getCurrentProvider: () => TiptapCollabProvider | null
}>(undefined as any)

const EditorProvider = ({ children }: React.PropsWithChildren) => {
  const docs$ = useObservable<TiptapDoc[] | null>(null)
  const docId$ = useObservable<string | null>(null)
  const editorDocId$ = useObservable<string | null>(null)
  const ydoc$ = useObservable(ObservableHint.opaque(new Y.Doc()))
  const currentEditor = useRef<Editor | null>(null)
  const status$ = useObservable<
    null | 'Connecting' | 'Offline' | 'Connected' | 'Disconnected'
  >(null)
  const syncing$ = useObservable<boolean>(true)
  const updateIdRef = useRef<Promise<string> | null>(null)

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

  const { createTiptapProvider, destroyProvider, getCurrentProvider } =
    useTiptapProvider({
      docId$,
      status$,
      syncing$,
      ydoc$,
      setDocId,
      updateIdRef,
      loadDocs
    })

  function setDocId(id: string | null, updateEditor = true) {
    batch(() => {
      const currentDocId = docId$.peek()
      if (id === currentDocId) {
        return
      }

      const currentYdoc = ydoc$.peek()
      if (!currentYdoc.isDestroyed && updateEditor) {
        currentYdoc.destroy()
      }
      if (id !== null) {
        ydoc$.set(ObservableHint.opaque(new Y.Doc()))
        syncing$.set(true)
      }
      docId$.set(id)
      // if (updateEditor) {
      editorDocId$.set(id)
      // }
      if (id !== null) {
        createTiptapProvider()
      } else {
        destroyProvider()
      }
    })
  }

  const createDoc = async () => {
    try {
      const data = await createDocApi()
      setDocId(data.id)
      await loadDocs()
    } catch (e) {
      console.error(e)
    }
  }

  const updateDoc = async (id: string, input: { id: string }) => {
    try {
      updateIdRef.current = new Promise((resolve, reject) => {
        updateDocApi(id, input.id)
          .then(() => resolve(input.id))
          .catch((e) => reject(e))
      })
      await updateIdRef.current
    } catch (e) {
      console.error(e)
    }
  }

  const deleteDoc = async (id: string) => {
    try {
      await deleteDocApi(id)
      await loadDocs()
      if (docId$.peek() === id) setDocId(null)
    } catch (e) {
      console.error(e)
    }
  }

  const exportDoc = (type: 'json' | 'html' | 'yjs') => {
    let exported
    if (type === 'json') {
      const ydoc = ydoc$.peek()
      const content = currentEditor.current?.getJSON()
      exported = { content, meta: ydoc.getMap('meta').toJSON() }
    }
    if (type === 'html') {
      exported = currentEditor.current?.getHTML()
    }
    if (type === 'yjs') {
      const ydoc = ydoc$.peek()
      exported = Y.encodeStateAsUpdate(ydoc)
    }

    console.log(exported)
  }

  return (
    <EditorContext.Provider
      value={{
        docs$,
        docId$,
        editorDocId$,
        createDoc,
        updateDoc,
        deleteDoc,
        ydoc$,
        exportDoc,
        currentEditor,
        status$,
        setDocId,
        syncing$,
        getCurrentProvider
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}

export default EditorProvider

export const useEditorContext = () => useContext(EditorContext)
