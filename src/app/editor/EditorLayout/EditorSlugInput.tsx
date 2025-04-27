import React from 'react'
import { useEditorContext } from '../hooks/EditorProvider'
import { use$ } from '@legendapp/state/react'
import { useDisplaySlugName } from '../hooks/useDisplaySlugName'
import './EditorSlugInput.css'

const regexNotAllowed = new RegExp('[^a-zA-Z0-9-]', 'g')
const sanitizeSlug = (input: string) => {
  return input.replace(regexNotAllowed, '')
}

export const EditorSlugInput = () => {
  const { docId$, updateDoc } = useEditorContext()
  const currentDocId = use$(docId$) as string
  const currentSlug = useDisplaySlugName(currentDocId)

  return (
    <div
      contentEditable='plaintext-only'
      suppressContentEditableWarning
      data-placeholder='Untitled'
      onInput={(e) => {
        const div = e.currentTarget
        if (!div) return

        const originalText = div.innerText
        const sanitizedText = sanitizeSlug(originalText)

        if (originalText !== sanitizedText) {
          const selection = window.getSelection()
          const range = selection!.getRangeAt(0)
          const cursorPosition = range.startOffset

          div.innerText = sanitizedText

          if ((e.nativeEvent as any).inputType === 'insertLineBreak') {
            div.blur()

            return
          }

          const newRange = document.createRange()
          newRange.setStart(
            div.childNodes[0] || div,
            Math.max(Math.min(cursorPosition - 1, sanitizedText.length), 0)
          )
          newRange.collapse(true)

          selection!.removeAllRanges()
          selection!.addRange(newRange)
        }
      }}
      onBlur={(e) => {
        const newId =
          currentDocId.replace(new RegExp(`${currentSlug}$`), '') +
          e.currentTarget.innerText
        if (currentDocId !== newId) {
          updateDoc(currentDocId, { id: newId })
        }
      }}
      className='editor-slug-input text-eva-text bg-transparent focus-visible:outline-none focus-visible:bg-eva-text/10 hover:bg-eva-text/10 px-1.5 rounded-md min-w-16'
    >
      {currentSlug}
    </div>
  )
}
