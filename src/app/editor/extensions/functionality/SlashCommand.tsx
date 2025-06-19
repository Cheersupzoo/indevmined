import { Slash, SlashCmd } from '@harshtalks/slash-tiptap'
import { Editor } from '@tiptap/core'

import { suggestionBlock } from '../nodes/nodes'

export const SlashWithConfigure = Slash.configure({
  suggestion: {
    items: () => suggestionBlock,
  },
})

export const SlashCommand = ({ editor }: { editor: Editor | null }) => {
  return (
    <SlashCmd.Root editor={editor}>
      <SlashCmd.Cmd className='px-1 py-2' loop>
        <SlashCmd.List>
          <SlashCmd.Empty>No commands available</SlashCmd.Empty>
          <SlashCmd.Group heading='Basic blocks'>
            {suggestionBlock.map((item) => {
              return (
                <SlashCmd.Item
                  value={item.title}
                  onCommand={(val) => {
                    item.command(val)
                  }}
                  key={item.title}
                >
                  <item.icon size={10} className='h-4 w-4 text-eva-text/50' />
                  <p>{item.title}</p>
                  <div className='ml-auto text-eva-text/50'>
                    {item.mdShortcut}
                  </div>
                </SlashCmd.Item>
              )
            })}
          </SlashCmd.Group>
        </SlashCmd.List>
      </SlashCmd.Cmd>
    </SlashCmd.Root>
  )
}
