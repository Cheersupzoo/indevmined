import { Mark } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    id: {
      setId: (id: string) => ReturnType
      toggleId: (id: string | null) => ReturnType
      unsetId: () => ReturnType
    }
  }
}

export const IdMark = Mark.create({
  name: 'id',
  addGlobalAttributes() {
    return [
      {
        types: ['heading', 'paragraph', 'codeBlock'],
        attributes: {
          id: {
            default: null,
            isRequired: false,
            renderHTML(attributes) {
              if (!attributes.id) {
                return {}
              }

              return { id: attributes.id }
            },
            parseHTML(element) {
              const id = element.getAttribute('id')
              if (id) {
                return id
              }

              return null
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setId:
        (id: string) =>
        ({ commands }) => {
          return commands.command(({ tr }) => {
            tr.setNodeAttribute(tr.selection.from, 'id', id.length ? id : null)

            return true
          })
        },
      toggleId:
        (id: string | null) =>
        ({ commands }) => {
          return commands.command(({ tr }) => {
            const currentId = tr.doc.nodeAt(tr.selection.from)?.attrs.id
            if (currentId === id) {
              tr.setNodeAttribute(tr.selection.from, 'id', null)
            } else {
              tr.setNodeAttribute(
                tr.selection.from,
                'id',
                id?.length ? id : null
              )
            }
            return true
          })
        },
      unsetId:
        () =>
        ({ commands }) => {
          return commands.command(({ tr }) => {
            tr.setNodeAttribute(tr.selection.from, 'id', null)
            return true
          })
        },
    }
  },
})
