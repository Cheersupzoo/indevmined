import { Extension } from '@tiptap/core'
import { dragHandlePlugin } from './ProseMirrorPlugin'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    dragHandle: {
      /**
       * Hide handle
       */
      hideDragHandle: () => ReturnType
    }
  }
}

export const DragHandle = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    return [dragHandlePlugin({editor: this.editor})]
  },
  addCommands() {
    return {
      hideDragHandle: () => () => {
        const preNodeContainer = document.querySelector(
          '.pre-node-tool-container'
        ) as HTMLDivElement
        if (preNodeContainer) {
          preNodeContainer.style.visibility = 'hidden'
        }

        return true
      }
    }
  }
})
