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
            paste(view, event) {
              let files = event.clipboardData?.files
              if (!files || files?.length === 0) {
                return false
              }
              const file = files[0]

              if (!file || !file.type.startsWith('image/')) {
                return false
              }

              event.preventDefault()

              editor
                .chain()
                .focus()
                .setImageUploadNode({ files: [...files] })
                .run()

              return true
            },
            drop(view, event) {
              if (event.dataTransfer?.effectAllowed === 'copyMove') {
                // Called from internal ProseMirror
                return false
              }
              let files = event.dataTransfer?.files
              if (!files || files.length === 0) {
                return false
              }
              event.preventDefault()

              let pos = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              })
              if (!pos) return

              editor
                .chain()
                .setTextSelection(pos.pos)
                // Reuse and apply Upload feature from ImageUploadNode
                .setImageUploadNode({ files: [...files] })
                .run()
            },
          },
        },
      }),
    ]
  },
})
