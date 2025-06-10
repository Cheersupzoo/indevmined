import Image from '@tiptap/extension-image'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { DecorationSet, EditorView } from '@tiptap/pm/view'

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

const resizeHandle = document.createElement('div')
resizeHandle.className = 'resize-handle'
resizeHandle.innerHTML = `
  <div class='resize-handle-line'></div>
`

const createResizeHandle = (
  view: EditorView,
  pos: number,
  imgElement: HTMLImageElement
) => {
  const handle = resizeHandle.cloneNode(true) as HTMLElement

  // Store the image reference
  let currentImg = imgElement
  let originalAspectRatio = currentImg.naturalWidth / currentImg.naturalHeight

  let startX = 0
  let startWidth = 0
  let lastWidth: number | undefined | null
  let lastHeight: number | undefined
  let dragging = false

  const onMouseDown = (e: MouseEvent | TouchEvent) => {
    // Only proceed for left mouse button or touch
    if ('button' in e && e.button !== 0) return

    e.preventDefault()
    e.stopPropagation()

    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX
    if (clientX === undefined) return

    dragging = true
    startX = clientX
    startWidth = currentImg.offsetWidth
    originalAspectRatio = currentImg.naturalWidth / currentImg.naturalHeight

    // Add both mouse and touch events for better compatibility
    document.addEventListener('mousemove', onMouseMove as EventListener)
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('mouseup', onMouseUp, { once: true })
    document.addEventListener('touchend', onMouseUp, { once: true })
  }

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging || !currentImg) return
    handleMove(e.clientX)
  }

  const onTouchMove = (e: TouchEvent) => {
    if (!dragging || !currentImg || !e.touches[0]) return
    handleMove(e.touches[0].clientX)
  }

  const handleMove = (clientX: number) => {
    if (!currentImg) return

    const deltaX = clientX - startX
    const newWidth = Math.max(200, startWidth + deltaX) // Minimum width of 200px
    const newHeight = newWidth / originalAspectRatio

    const editorWidth = view.dom.clientWidth
    // Only update the DOM for visual feedback during drag
    if (newWidth > editorWidth) {
      currentImg.style.width = '100%'
    } else {
      currentImg.style.width = `${newWidth}px`
    }
    currentImg.style.height = 'auto'

    // Store the latest dimensions to be used in onMouseUp
    if (newWidth > editorWidth) {
      lastWidth = null
    } else {
      lastWidth = newWidth
    }
    lastHeight = newHeight
  }

  const onMouseUp = () => {
    if (!dragging) return

    dragging = false

    // Remove all event listeners
    document.removeEventListener('mousemove', onMouseMove as EventListener)
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.removeEventListener('touchend', onMouseUp)

    // Update the node attributes with final dimensions
    if (
      pos === undefined ||
      lastWidth === undefined ||
      lastHeight === undefined
    ) {
      // Reset styles if we can't update the node
      if (currentImg) {
        currentImg.style.width = ''
        currentImg.style.height = ''
      }
      return
    }

    const transaction = view.state.tr.setNodeMarkup(pos, undefined, {
      ...view.state.doc.nodeAt(pos)?.attrs,
      width: lastWidth,
      height: lastHeight
    })

    view.dispatch(transaction)

    // Clean up any temporary styles
    if (currentImg) {
      currentImg.style.width = ''
      currentImg.style.height = ''
    }
  }

  handle.addEventListener('mousedown', onMouseDown as EventListener)
  handle.addEventListener('touchstart', onMouseDown, { passive: true })

  return handle
}

export const CustomImage = Image.extend<ImageOptions>({
  addOptions() {
    return {
      ...this.parent?.(),
      deleteImage: undefined
    }
  },
  addAttributes() {
    return {
      ...(this.parent?.() || {}),
      width: {
        default: null
      }
    }
  },
  addNodeView() {
    return ({ view, getPos, HTMLAttributes }) => {
      // Create a container div that will hold both the image and the resize handle
      const container = document.createElement('div')
      container.className = 'image-container' // Add class for styling

      // Create and append the image
      const img = document.createElement('img')
      img.className = 'resizable-image' // Add class for styling

      // Set attributes
      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        if (value) {
          img.setAttribute(key, value)
        }
      })

      container.appendChild(img)

      const rightHandle = createResizeHandle(view, getPos(), img)
      container.appendChild(rightHandle)

      // The resize handle will be added by the plugin
      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type !== this.type) {
            return false
          }

          Object.entries(updatedNode.attrs).forEach(([key, value]) => {
            if (img.getAttribute(key) !== value) {
              if (value === null) {
                img.removeAttribute(key)
              } else {
                img.setAttribute(key, value)
              }
            }
          })

          return true
        }
      }
    }
  },
  addProseMirrorPlugins() {
    const parentPlugins = this.parent?.() || []
    const plugins: Plugin[] = []

    // Add delete image plugin if needed
    if (this.options.deleteImage) {
      plugins.push(
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
      )
    }

    return [...parentPlugins, ...plugins]
  }
})
