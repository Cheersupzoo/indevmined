import { Mark, mergeAttributes } from '@tiptap/core'

export interface PlayfulOptions {
  /**
   * HTML attributes to add to the playful element.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    playful: {
      /**
       * Set an playful mark
       * @example editor.commands.setPlayful()
       */
      setPlayful: () => ReturnType
      /**
       * Toggle an playful mark
       * @example editor.commands.togglePlayful()
       */
      togglePlayful: () => ReturnType
      /**
       * Unset an playful mark
       * @example editor.commands.unsetPlayful()
       */
      unsetPlayful: () => ReturnType
    }
  }
}

/**
 * This extension allows you to create make text look playful.
 */
export const Playful = Mark.create<PlayfulOptions>({
  name: 'playful',

  addOptions() {
    return {
      HTMLAttributes: {}
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span.playful'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: 'playful'
      }),
      0
    ]
  },

  addCommands() {
    return {
      setPlayful:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name)
        },
      togglePlayful:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name)
        },
      unsetPlayful:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        }
    }
  }
})
