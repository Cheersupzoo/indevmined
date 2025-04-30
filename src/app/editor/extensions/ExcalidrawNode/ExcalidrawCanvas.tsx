import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Excalidraw, exportToSvg } from '@excalidraw/excalidraw'
import type {
  ExcalidrawElement,
  NonDeletedExcalidrawElement,
  Ordered
} from '@excalidraw/excalidraw/element/types'
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import React, { useRef } from 'react'

const ExcalidrawCanvas = ({
  initialElements,
  onSave
}: {
  initialElements: readonly ExcalidrawElement[]
  onSave: (update: {
    state: readonly Ordered<NonDeletedExcalidrawElement>[]
    svg: any
  }) => void
}) => {
  const excalidrawApi = useRef<ExcalidrawImperativeAPI | null>(null)

  const onSaveImpl = async () => {
    if (!excalidrawApi.current) return
    const state = excalidrawApi.current.getSceneElements()
    const appState = excalidrawApi.current.getAppState()

    const svg = await exportToSvg({ elements: state, appState })

    svg.style.cssText = 'height:100%;'
    onSave({ state: state, svg: svg.outerHTML })
  }

  return (
    <>
      <div className=''>
        <div className='h-full w-full border border-eva-text-border rounded-md overflow-hidden'>
          <Excalidraw
            initialData={{
              elements: initialElements,
              appState: {
                zenModeEnabled: true,
                viewBackgroundColor: `rgb(${getComputedStyle(
                  document.body
                ).getPropertyValue('--bg-color')})`
              }
            }}
            // onChange={(element) => (state.current = element)}
            excalidrawAPI={(api) => (excalidrawApi.current = api)}
            UIOptions={{
              canvasActions: {
                export: false,
                clearCanvas: false,
                saveAsImage: false,
                changeViewBackgroundColor: false,
                loadScene: false,
                toggleTheme: false,
                saveToActiveFile: false
              }
            }}
            theme='light'
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onSaveImpl} type='submit'>
          Save changes
        </Button>
      </DialogFooter>
    </>
  )
}

export default ExcalidrawCanvas
