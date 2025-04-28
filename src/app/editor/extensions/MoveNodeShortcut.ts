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

function moveBlock(editor: Editor, direction: 'up' | 'down') {
  // Get the current selection and state
  const { state, dispatch } = editor.view
  const { selection, doc } = state

  // Find the current node and its position
  const $pos = selection.$from
  const depth = $pos.depth

  // We want to move at the block level, so we need to find the closest block node
  const startPos = $pos.start(depth)
  const endPos = $pos.end(depth)
  const nodeSize = endPos - startPos + 1 // +1 for the closing position
  const selectorPadding = $pos.pos - startPos // for returning to the cursor last pos

  // Find the parent node
  const parentDepth = depth - 1
  if (parentDepth < 0) return false // We're at the top level

  const parentPos = $pos.start(parentDepth)
  const parentNode = $pos.node(parentDepth)

  if (!parentNode) return false

  // Find the index of the current node in its parent
  const index = $pos.index(parentDepth)

  // Determine the new index based on direction
  const newIndex =
    direction === 'up'
      ? Math.max(0, index - 1)
      : Math.min(parentNode.childCount - 1, index + 1)

  // If there's no change, exit
  if (newIndex === index) return false

  // Create a new transaction
  const tr = state.tr

  // Get the node's position
  const nodePos = $pos.before(depth)

  // Get the node that we're moving
  const node = doc.nodeAt(nodePos)
  if (!node) return false

  // Delete the node from its current position
  tr.delete(nodePos, nodePos + nodeSize)

  // Calculate the new position for insertion
  let insertPos
  if (direction === 'up') {
    // When moving up, we insert before the previous node
    insertPos =
      newIndex === 0 ? parentPos : $pos.posAtIndex(newIndex, parentDepth)
  } else {
    // When moving down, we insert after the next node
    insertPos = $pos.posAtIndex(newIndex, parentDepth)
    // If we're moving to the end, we need to add any previous node sizes
    if (newIndex > index) {
      const nextNode = doc.nodeAt(insertPos)
      if (nextNode) {
        insertPos += nextNode.nodeSize
        insertPos -= node.nodeSize // accounting for the itself size
      }
    }
  }

  // Insert the node at the new position
  tr.insert(insertPos, node)

  // Set the selection to the moved node
  const newNodePos = insertPos
  const newSelection = TextSelection.create(
    tr.doc,
    newNodePos + 1 + selectorPadding
  )
  tr.setSelection(newSelection)

  // Apply the transaction
  dispatch(tr)

  return true
}
