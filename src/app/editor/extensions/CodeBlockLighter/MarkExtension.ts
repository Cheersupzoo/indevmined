import { Mark, mergeAttributes } from '@tiptap/core'

export interface CodeHighlightOptions {
  /**
   * HTML attributes to add to the highlight element.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    highlightCode: {
      /**
       * Set a highlight mark
       */
      setCodeHighlight: (color?: string) => ReturnType
      /**
       * Toggle a highlight mark
       */
      toggleCodeHighlight: (color?: string) => ReturnType
      /**
       * Unset a highlight mark
       */
      unsetCodeHighlight: () => ReturnType
    }
  }
}

export const CodeMark = Mark.create<CodeHighlightOptions>({
  name: 'highlightMark',
  group: 'codeMark',

  addAttributes() {
    return {
      color: {
        default: 'gold',
        renderHTML: (attributes) => {
          if (!attributes.color) {
            return {}
          }

          return {
            style: `background-color: rgb(from ${attributes.color} r g b / 0.13); display: inline-block;`
          }
        }
      }
    }
  },
  addCommands() {
    return {
      setCodeHighlight:
        (color: string = 'gold') =>
        ({ commands }) => {
          return commands.setMark(this.name, { color })
        },
      toggleCodeHighlight:
        (color: string = 'gold') =>
        ({ commands }) => {
          return commands.toggleMark(this.name, { color })
        },
      unsetCodeHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        }
    }
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0
    ]
  }
})
