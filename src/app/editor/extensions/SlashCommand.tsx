import {
  createSuggestionsItems,
  Slash,
  SlashCmd
} from '@harshtalks/slash-tiptap'
import { Editor } from '@tiptap/core'

const suggestions = createSuggestionsItems([
  {
    title: 'text',
    searchTerms: ['paragraph'],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode('paragraph', 'paragraph')
        .run()
    }
  },
  {
    title: 'Bullet List',
    searchTerms: ['unordered', 'point'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    }
  },
  {
    title: 'Ordered List',
    searchTerms: ['ordered', 'point', 'numbers'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    }
  },
  {
    title: 'Image',
    searchTerms: ['img', 'photo'],
    command: ({ editor, range }) => {
      const url = window.prompt('URL')

      if (url) {
        editor.chain().focus().deleteRange(range).setImage({ src: url }).run()
      }
    }
  },
  {
    title: 'React Component',
    searchTerms: ['react'],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'reactComponent',
          attrs: { count: 9 },
          content: [{ type: 'paragraph' }]
        })
        .run()
    }
  }
])

export const SlashWithConfigure = Slash.configure({
  suggestion: {
    items: () => suggestions
  }
})

export const SlashCommand = ({ editor }: { editor: Editor | null }) => {
  return (
    <SlashCmd.Root editor={editor}>
      <SlashCmd.Cmd>
        <SlashCmd.Empty>No commands available</SlashCmd.Empty>
        <SlashCmd.List>
          <SlashCmd.Group heading='Blocks'>
            {suggestions.map((item) => {
              return (
                <SlashCmd.Item
                  value={item.title}
                  onCommand={(val) => {
                    item.command(val)
                  }}
                  key={item.title}
                >
                  <p>{item.title}</p>
                </SlashCmd.Item>
              )
            })}
          </SlashCmd.Group>
        </SlashCmd.List>
      </SlashCmd.Cmd>
    </SlashCmd.Root>
  )
}
