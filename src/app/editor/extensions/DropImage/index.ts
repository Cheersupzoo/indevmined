import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export const DropImageExtension = Extension.create({
  addProseMirrorPlugins() {
    const editor = this.editor

    return [
      new Plugin({
        key: new PluginKey('DropImage'),
        props: {
          handleDOMEvents: {
            drop(view, event) {
              event.preventDefault()
              let files = event.dataTransfer?.files
              if (!files || files.length === 0) {
                return
              }

              let pos = view.posAtCoords({
                left: event.clientX,
                top: event.clientY
              })
              if (!pos) return

              editor
                .chain()
                .setTextSelection(pos.pos)
                // Reuse and apply Upload feature from ImageUploadNode
                .setImageUploadNode({ files: [...files] })
                .run()
            }
          }
        }
      })
    ]
  }
})
