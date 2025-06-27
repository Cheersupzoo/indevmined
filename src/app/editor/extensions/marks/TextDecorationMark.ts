import { Mark, mergeAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textDecoration: {
      /**
       * Set a text decoration mark
       */
      setTextDecoration: (num?: number, isBg?: boolean) => ReturnType
      /**
       * Toggle a text decoration mark
       */
      toggleTextDecoration: (num?: number, isBg?: boolean) => ReturnType
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
            style: attributes.isBg
              ? `background-color: rgb(var(--color${attributes.num}) / 0.5)`
              : `color: rgb(var(--color${attributes.num}))`,
          }
        },
        parseHTML(element) {
          const color = element.style.color || element.style.backgroundColor
          if (color && color.startsWith('rgb(var(--color')) {
            return parseInt(color.slice(15, 16))
          }

          return null
        },
      },
      isBg: {
        default: false,
        renderHTML: (attributes) => {
          return {}
        },
        parseHTML(element) {
          return !!element.style.backgroundColor
        },
      },
    }
  },

  addCommands() {
    return {
      setTextDecoration:
        (num: number = 3, isBg: boolean = false) =>
        ({ commands }) => {
          return commands.setMark(this.name, { num, isBg })
        },
      toggleTextDecoration:
        (num: number = 3, isBg: boolean = false) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, { num, isBg })
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
