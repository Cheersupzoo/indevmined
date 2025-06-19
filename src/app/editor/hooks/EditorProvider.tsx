'use client'

import { useRouter } from 'next/navigation'
import React, { createContext, useContext, useRef } from 'react'

import * as Y from 'yjs'
import {
  createDoc as createDocApi,
  deleteDoc as deleteDocApi,
  getDocs,
  updateDoc as updateDocApi,
} from '@/apis/editor'
import { stringifyMarkdown } from '@/utils/Tiptap/stringifyMarkdown'
import { type TiptapCollabProvider } from '@hocuspocus/provider'
import {
  type Observable,
  type ObservableBoolean,
  ObservableHint,
  type ObservablePrimitive,
  type OpaqueObject,
  batch,
} from '@legendapp/state'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import { useObservable } from '@legendapp/state/react'
import { synced } from '@legendapp/state/sync'
import { Editor } from '@tiptap/core'
import { clearDocument } from 'y-indexeddb'

import { SearchParamHandler } from './SearchParamHandler'
import { useLocalProvider } from './useLocalProvider'
import { useTiptapProvider } from './useTiptapProvider'

export type TiptapDoc = {
  created_at: string
  name: string
  size: number
  updated_at: string
}

export type EditorStatus =
  | 'Connecting'
  | 'Offline'
  | 'Connected'
  | 'Disconnected'
  | null

type ExportType = 'json' | 'html' | 'yjs' | 'md'

type IsActive = {
  bold: boolean
  italic: boolean
  strike: boolean
  underline: boolean
  link: boolean
  highlightMark: boolean
  codeBlock: boolean
  paragraph: boolean
  code: boolean
  playful: boolean
}

const EditorContext = createContext<{
  docs$: Observable<TiptapDoc[] | null>
  docId$: Observable<string | null>
  editorDocId$: ObservablePrimitive<string | null>
  createDoc: () => void
  updateDoc: (id: string, input: { id: string }) => void
  deleteDoc: (id: string) => Promise<void>
  ydoc$: Observable<OpaqueObject<Y.Doc>>
  exportDoc: (type: ExportType) => void
  currentEditor: {
    peek: () => Editor
  } & Observable<OpaqueObject<Editor> | null>
  isActive$: Observable<IsActive>
  status$: ObservablePrimitive<EditorStatus>
  setDocId: (id: string | null) => void
  syncing$: ObservableBoolean
  getCurrentProvider: () => TiptapCollabProvider | null
  loadDocsPromiseRef: React.MutableRefObject<Promise<void> | null>
}>(undefined as any)

const EditorProvider = ({ children }: React.PropsWithChildren) => {
  const docs$ = useObservable<TiptapDoc[] | null>(
    synced({
      initial: null,
      persist: {
        name: 'docs',
        plugin: ObservablePersistLocalStorage,
      },
    })
  )
  const docId$ = useObservable<string | null>(null)
  const editorDocId$ = useObservable<string | null>(null)
  const ydoc$ = useObservable(ObservableHint.opaque(new Y.Doc()))
  const currentEditor = useObservable<OpaqueObject<Editor> | null>(null) as {
    peek: () => Editor
  } & Observable<OpaqueObject<Editor> | null>
  const isActive$ = useObservable<IsActive>({
    bold: false,
    italic: false,
    strike: false,
    underline: false,
    link: false,
    highlightMark: false,
    codeBlock: false,
    paragraph: false,
    code: false,
    playful: false,
  })
  const status$ = useObservable<EditorStatus>(null)
  const syncing$ = useObservable<boolean>(true)
  const updateIdRef = useRef<Promise<string> | null>(null)
  const loadDocsPromiseRef = useRef<Promise<void> | null>(null)
  const router = useRouter()

  const loadDocsImpl = async () => {
    try {
      const data = await getDocs()
      if (data.docs) {
        docs$.set(data.docs)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const loadDocs = async () => {
    loadDocsPromiseRef.current = loadDocsImpl()
    loadDocsPromiseRef.current.then(() => (loadDocsPromiseRef.current = null))

    return loadDocsPromiseRef.current
  }

  useRef(
    !loadDocsPromiseRef.current &&
      (() => {
        loadDocs()
      })()
  )

  const { createTiptapProvider, destroyProvider, getCurrentProvider } =
    useTiptapProvider({
      docId$,
      status$,
      syncing$,
      ydoc$,
      updateIdRef,
      loadDocs,
    })

  const { createLocalProvider, destroyLocalProvider } = useLocalProvider({
    docId$,
    syncing$,
    ydoc$,
  })

  function setDocId(id: string | null) {
    batch(() => {
      const currentDocId = docId$.peek()
      if (id === currentDocId) {
        return
      }

      const currentYdoc = ydoc$.peek()
      if (!currentYdoc.isDestroyed) {
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
        createLocalProvider()
        createTiptapProvider()
      } else {
        destroyLocalProvider()
        destroyProvider()
      }
    })
  }

  const createDoc = async () => {
    try {
      const data = await createDocApi()
      await loadDocs()
      // setDocId(data.id)
      router.push('/editor?' + new URLSearchParams({ id: data.id }))
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
      clearDocument(id)
      await deleteDocApi(id)
      await loadDocs()
      if (docId$.peek() === id) router.push('/editor')
    } catch (e) {
      console.error(e)
    }
  }

  const exportDoc = (type: ExportType) => {
    let exported
    if (type === 'json') {
      const ydoc = ydoc$.peek()
      const content = currentEditor.peek()?.getJSON()
      exported = { content, meta: ydoc.getMap('meta').toJSON() }
    }
    if (type === 'html') {
      exported = currentEditor.peek()?.getHTML()
    }
    if (type === 'yjs') {
      const ydoc = ydoc$.peek()
      exported = Y.encodeStateAsUpdate(ydoc)
    }
    if (type === 'md') {
      const editor = currentEditor.peek()
      exported = stringifyMarkdown(editor.state.doc, editor.schema)
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
        isActive$,
        status$,
        setDocId,
        syncing$,
        getCurrentProvider,
        loadDocsPromiseRef,
      }}
    >
      <SearchParamHandler />
      {children}
    </EditorContext.Provider>
  )
}

export default EditorProvider

export const useEditorContext = () => useContext(EditorContext)
