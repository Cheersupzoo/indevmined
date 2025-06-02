import { Editor, Extension } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    moveBlock: {
      /**
       * Move current block up by 1 pos
       */
      moveBlockUp: () => ReturnType
      /**
       * Move current block down by 1 pos
       */
      moveBlockDown: () => ReturnType
    }
  }
}

/**
 * Allow to use Alt+ArrowUp/Down to move block
 * Not support: List
 */
export const MoveNodeShortcut = Extension.create({
  name: 'moveNodeShortcut',
  addOptions() {
    return {
      moveUpShortcut: 'Alt-ArrowUp',
      moveDownShortcut: 'Alt-ArrowDown'
    }
  },
  addCommands() {
    return {
      moveBlockUp: () => () => {
        moveBlock(this.editor, 'up')

        return true
      },
      moveBlockDown: () => () => {
        moveBlock(this.editor, 'down')

        return true
      }
    }
  },
  addKeyboardShortcuts() {
    return {
      [this.options.moveUpShortcut]: () => moveBlock(this.editor, 'up'),
      [this.options.moveDownShortcut]: () => moveBlock(this.editor, 'down')
    }
  }
})

const listType = new Set(['listItem', 'taskItem'])

function moveBlock(editor: Editor, direction: 'up' | 'down') {
  // Get the current selection and state
  const { state, dispatch } = editor.view
  const { selection, doc } = state

  // Find the current node and its position
  let $pos = selection.$from
  let index = $pos.index($pos.depth - 1)
  let parent = $pos.node(Math.max(0, $pos.depth - 1))

  if (listType.has(parent.type.name)) {
    // Move up 1 depth on listItem
    $pos = doc.resolve($pos.before())
    index = $pos.index($pos.depth - 1)
    parent = $pos.node(Math.max(0, $pos.depth - 1))
  }
  const parentPos = $pos.start(Math.max(0, $pos.depth - 1))
  const parentResPos = doc.resolve(parentPos)
  const isMoveInsideParent =
    direction === 'up' ? 0 < index : index < parent.children.length - 1

  if (isMoveInsideParent) {
    const newIndex = direction === 'up' ? index - 1 : index + 1

    const replacePos = parentResPos.posAtIndex(newIndex)
    const replaceNode = doc.nodeAt(replacePos)
    const node = doc.nodeAt($pos.before())
    const tr = state.tr
    const nodeRange = $pos.blockRange()

    if (!nodeRange || !node || !replaceNode) {
      return false
    }

    if (direction === 'up') {
      tr.delete(nodeRange.start, nodeRange.end)
      tr.insert(replacePos, node)
    } else {
      tr.insert(replacePos + replaceNode.nodeSize, node)
      tr.delete(nodeRange.start, nodeRange.end)
    }

    const startPos = $pos.start()
    const selectorPadding = $pos.pos - startPos // for returning to the cursor last pos

    const newSelection = TextSelection.create(
      tr.doc,
      1 +
        (direction === 'up'
          ? replacePos + selectorPadding
          : replacePos + replaceNode.nodeSize - node.nodeSize + selectorPadding)
    )
    tr.setSelection(newSelection)

    dispatch(tr)

    return true
  }

  return true
}
