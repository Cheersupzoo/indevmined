import { Observable, ObservableBoolean } from '@legendapp/state'
import { useRef } from 'react'
import { IndexeddbPersistence } from 'y-indexeddb'
import { Doc } from 'yjs'

export const useLocalProvider = ({
  docId$,
  ydoc$,
  syncing$
}: {
  docId$: Observable<string | null>
  ydoc$: Observable<Doc>
  syncing$: ObservableBoolean
}) => {
  const localProviderRef = useRef<IndexeddbPersistence | null>(null)

  const createLocalProvider = () => {
    const docId = docId$.peek(),
      ydoc = ydoc$.peek()
    if (!docId) {
      return
    }
    destroyLocalProvider()
    const localProvider = new IndexeddbPersistence(docId, ydoc)
    localProvider.whenSynced.then((idb) => idb.synced && syncing$.set(false))
    localProviderRef.current = localProvider
  }

  const destroyLocalProvider = () => {
    if (localProviderRef.current) {
      localProviderRef.current.destroy()
    }
  }

  return {
    createLocalProvider,
    destroyLocalProvider
  }
}
