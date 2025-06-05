import { mergeAttributes, Node } from '@tiptap/core'

export const GroupBlock = Node.create({
  name: 'groupBlock',

  group: 'block',

  content: 'block+',

  defining: true,

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
  }
})
