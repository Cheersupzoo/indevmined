import { Node, mergeAttributes } from '@tiptap/core'

import { ToggleSectionStatic } from './static'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    toggleSection: {
      toggleSection: (attributes?: { collapsed?: boolean }) => ReturnType
      toggleSectionCollapse: () => ReturnType
    }
  }
}

export interface ToggleSectionOptions {
  HTMLAttributes: Record<string, any>
}

const toggleSectionName = 'toggleSection'

export const ToggleSection = Node.create<ToggleSectionOptions>({
  name: toggleSectionName,

  group: 'block',

  content: 'paragraph groupBlock',

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      collapsed: {
        default: false,
        parseHTML: (element) => ({
          collapsed: element.getAttribute('data-collapsed') === 'true',
        }),
        renderHTML: (attributes) => ({
          'data-collapsed': attributes.collapsed,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'section',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['section', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const section = document.createElement('section')
      const toggle = section.appendChild(document.createElement('div'))
      toggle.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path fill="currentColor" d="m 6 9 l 6 6 l 6 -6 Z"/></svg>'
      toggle.className = 'toggle'
      const content = section.appendChild(document.createElement('div'))
      content.className = 'toggle-content'

      toggle.addEventListener('mousedown', () => {
        if (typeof getPos === 'function') {
          editor
            .chain()
            .focus(undefined, { scrollIntoView: false })
            .command(({ tr }) => {
              const position = getPos()
              if (typeof position !== 'number') {
                return false
              }

              const currentNode = tr.doc.nodeAt(position)
              if (!currentNode) {
                return false
              }
              tr.setNodeAttribute(
                position,
                'collapsed',
                !currentNode.attrs.collapsed
              )

              return true
            })
            .run()
        }
      })

      section.dataset.collapsed = node.attrs.collapsed.toString()
      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        section.setAttribute(key, value)
      })

      return {
        dom: section,
        contentDOM: content,
        update: (updatedNode) => {
          if (updatedNode.type !== this.type) {
            return false
          }

          section.dataset.collapsed = updatedNode.attrs.collapsed.toString()

          return true
        },
      }
    }
  },

  addCommands() {
    return {
      toggleSection:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { collapsed: false, ...attributes },
            content: [
              { type: 'paragraph' },
              { type: 'groupBlock', content: [{ type: 'paragraph' }] },
            ],
          })
        },
      toggleSectionCollapse:
        () =>
        ({ commands, state }) => {
          const { $from } = state.selection
          const node = $from.node($from.depth)

          if (node.type.name === this.name) {
            return commands.updateAttributes(this.name, {
              collapsed: !node.attrs.collapsed,
            })
          }

          return false
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-t': () => this.editor.commands.toggleSection(),
      'Mod-Alt-c': () => this.editor.commands.toggleSectionCollapse(),
    }
  },

  reactNode: ToggleSectionStatic,
})

export default ToggleSection
