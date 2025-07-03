import { Mark, mergeAttributes } from '@tiptap/core'

type AnimationType = 'blinking'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    animation: {
      /**
       * Set an animation mark
       * @example editor.commands.setAnimation()
       */
      setAnimation: (type?: AnimationType) => ReturnType
      /**
       * Toggle an animation mark
       * @example editor.commands.toggleAnimation()
       */
      toggleAnimation: (type?: AnimationType) => ReturnType
      /**
       * Unset an animation mark
       * @example editor.commands.unsetAnimation()
       */
      unsetAnimation: () => ReturnType
    }
  }
}

/**
 * This extension allows you to create make text look playful.
 */
export const AnimationMark = Mark.create({
  name: 'animation',

  addAttributes() {
    return {
      type: {
        default: 'blinking',
        renderHTML(attributes) {
          if (!attributes.type) {
            return {}
          }

          return { class: attributes.type }
        },
        parseHTML(element) {
          const type = element.classList[0]
          if (type) {
            return { type }
          }

          return null
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span.animation',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        class: 'animation',
      }),
      0,
    ]
  },

  addCommands() {
    return {
      setAnimation:
        (type) =>
        ({ commands }) => {
          return commands.setMark(this.name, { type })
        },
      toggleAnimation:
        (type) =>
        ({ commands }) => {
          console.log(type)

          return commands.toggleMark(this.name, type ? { type } : undefined)
        },
      unsetAnimation:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
    }
  },
})
