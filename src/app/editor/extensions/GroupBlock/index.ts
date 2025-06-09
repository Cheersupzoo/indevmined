import { mergeAttributes, Node } from '@tiptap/core'
import { Selection } from '@tiptap/pm/state'

export interface GroupBlockOptions {
  /**
   * Define whether the node should be exited on double enter.
   * @default true
   */
  exitOnDoubleEnter: boolean
  /**
   * Custom HTML attributes that should be added to the rendered HTML tag.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>
}

export const GroupBlock = Node.create<GroupBlockOptions>({
  name: 'groupBlock',

  group: 'block',

  content: 'block+',

  defining: true,

  addOptions() {
    return {
      exitOnDoubleEnter: true,
      HTMLAttributes: {}
    }
  },

  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': this.name
      }),
      0
    ]
  },

  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const div = document.createElement('div')
      div.dataset.type = this.name

      return {
        dom: div,
        contentDOM: div,
        update: (updatedNode) => {
          if (updatedNode.type !== this.type) {
            return false
          }

          return true
        }
      }
    }
  },

  addKeyboardShortcuts() {
    return {
      // exit node on double enter
      Enter: ({ editor }) => {
        if (!this.options.exitOnDoubleEnter) {
          return false
        }

        const { state } = editor
        const { selection, doc } = state
        const { $from, empty } = selection

        if (!empty) {
          return false
        }

        const thisNode = $from.node($from.depth - 1)
        if (!thisNode || thisNode.type !== this.type) {
          return false
        }

        const isAtEnd = $from.parent === thisNode.lastChild
        const endsWithEmptyParagraph =
          thisNode.lastChild?.type.name === 'paragraph' &&
          thisNode.lastChild?.childCount === 0

        if (!isAtEnd || !endsWithEmptyParagraph) {
          return false
        }

        let after = $from.after($from.depth - 2) // after this's parent node

        if (after === undefined) {
          return false
        }

        const nodeAfter = doc.nodeAt(after)

        if (nodeAfter) {
          return editor.commands.command(({ tr }) => {
            tr.delete($from.before(), $from.after())

            tr.setSelection(
              Selection.near(tr.doc.resolve(tr.mapping.map(after)))
            ) // not necessary as the delete will place current selection same as this

            return true
          })
        }

        return editor.commands.command(({ tr }) => {
          tr.delete($from.before(), $from.after())
          after = tr.mapping.map(after)
          tr.insert(after, this.editor.schema.nodes.paragraph.create())

          return true
        })
      }
    }
  }
})
