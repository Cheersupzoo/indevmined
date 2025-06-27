import { deleteImage } from "@/apis/editor"
import { Extensions } from "@tiptap/core"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import StarterKit from "@tiptap/starter-kit"
import { CustomImage } from "./CustomImage"
import { GroupBlock } from "./GroupBlock"
import ToggleSection from "./ToggleSection"

export const basedNodeExtensions: Extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3, 4] },
    history: false,
    codeBlock: false,
  }),

  // Node
  CustomImage.configure({
    deleteImage(url) {
      if (url.startsWith('https://cdn.indevmined.com')) {
        const key = url.replace('https://cdn.indevmined.com/', '')
        deleteImage(key)
      }
    },
  }),
  // TODO: Remove TestComponent
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  GroupBlock,
  ToggleSection,
]
