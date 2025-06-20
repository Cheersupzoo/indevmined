import { Mark, mergeAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textDecoration: {
      /**
       * Set a text decoration mark
       */
      setTextDecoration: (num?: number) => ReturnType
      /**
       * Toggle a text decoration mark
       */
      toggleTextDecoration: (num?: number) => ReturnType
      /**
       * Unset a text decoration mark
       */
      unsetTextDecoration: () => ReturnType
    }
  }
}

export const TextDecorationMark = Mark.create({
  name: 'textDecorationMark',

  addAttributes() {
    return {
      num: {
        default: 3,
        renderHTML: (attributes) => {
          if (!attributes.num) {
            return {}
          }

          return {
            style: `color: rgb(var(--color${attributes.num}))`,
          }
        },
        parseHTML(element) {
          const color = element.style.color
          if (color && color.startsWith('rgb(var(--color')) {
            return parseInt(color.slice(15, 16))
          }

          return null
        },
      },
    }
  },

  addCommands() {
    return {
      setTextDecoration:
        (num: number = 3) =>
        ({ commands }) => {
          return commands.setMark(this.name, { num })
        },
      toggleTextDecoration:
        (num: number = 3) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, { num })
        },
      unsetTextDecoration:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
    }
  },

  parseHTML() {
    return [{ tag: 'span.text-decoration' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, { class: 'text-decoration' }),
      0,
    ]
  },
})
