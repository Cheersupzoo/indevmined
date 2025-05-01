import Image from '@tiptap/extension-image'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { DecorationSet } from '@tiptap/pm/view'

export interface ImageOptions {
  /**
   * Controls if the image node should be inline or not.
   * @default false
   * @example true
   */
  inline: boolean

  /**
   * Controls if base64 images are allowed. Enable this if you want to allow
   * base64 image urls in the `src` attribute.
   * @default false
   * @example true
   */
  allowBase64: boolean

  /**
   * HTML attributes to add to the image element.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>
  deleteImage: ((key: string) => void) | undefined
}

export const CustomImage = Image.extend<ImageOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      deleteImage: undefined
    }
  },
  addProseMirrorPlugins() {
    if (!this.options.deleteImage) {
      return []
    }

    return [
      new Plugin({
        key: new PluginKey('image'),
        state: {
          init: () => DecorationSet.empty,
          apply: (transaction, decorationSet, oldState, newState) => {
            const oldImages = new Set<string>()
            oldState.doc.descendants((node) => {
              if (node.type.name === 'image') {
                oldImages.add(node.attrs.src)

                return false
              }

              return true
            })

            const newImages = new Set<string>()
            newState.doc.descendants((node) => {
              if (node.type.name === 'image') {
                newImages.add(node.attrs.src)

                return false
              }

              return true
            })

            const toRemoveImage = oldImages.difference(newImages)
            if (toRemoveImage.size) {
              toRemoveImage.forEach((image) => {
                this.options.deleteImage?.(image)
              })
            }

            return DecorationSet.empty
          }
        }
      })
    ]
  }
})
