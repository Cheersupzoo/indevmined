import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

import { useEditorContext } from './EditorProvider'

export const SearchParamHandler = () => {
  const searchParams = useSearchParams()

  const router = useRouter()
  const { loadDocsPromiseRef, setDocId, docs$ } = useEditorContext()
  useEffect(() => {
    const id = searchParams.get('id')
    if (!id) {
      setDocId(null)
      return
    }
    const setId = async () => {
      if (loadDocsPromiseRef.current) {
        await loadDocsPromiseRef.current
      }
      const docs = docs$.peek()
      if (!docs) {
        setDocId(null)
        console.log('docs is null')
        return
      }

      const docIds = docs.map(({ name }) => name)

      if (docIds.includes(id)) {
        setDocId(id)
      } else {
        router.push('/editor')
      }
    }
    setId()
  }, [searchParams])

  return <></>
}
