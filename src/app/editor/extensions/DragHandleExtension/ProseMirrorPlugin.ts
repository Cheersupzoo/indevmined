import { Editor } from '@tiptap/core'
import { Node } from '@tiptap/pm/model'
import { EditorState, Plugin, PluginKey, TextSelection } from '@tiptap/pm/state'
import { dropPoint } from '@tiptap/pm/transform'
import { EditorView } from '@tiptap/pm/view'

// Define plugin state interface
interface DragHandlePluginState {
  hoveredNode: number | null
  showHandle: boolean
}

// Define dragged node interface
interface DraggedNodeInfo {
  node: Node
  pos: number
  end: number
}

// Plugin key to allow accessing plugin state from outside
const dragHandlePluginKey = new PluginKey<DragHandlePluginState>('dragHandle')

const ignoreNode = new Set(['bulletList', 'orderedList', 'taskList'])

// Create a new plugin for drag handles
export function dragHandlePlugin({
  editor,
}: {
  editor: Editor
}): Plugin<DragHandlePluginState> {
  return new Plugin<DragHandlePluginState>({
    key: dragHandlePluginKey,
    // View method to handle the drag operation
    view(editorView: EditorView) {
      const preNodeContainer = document.querySelector(
        '.pre-node-tool-container'
      ) as HTMLDivElement
      const handleNode = document.querySelector(
        '.drag-handle'
      ) as HTMLDivElement
      if (!handleNode || !preNodeContainer) {
        return {
          update: () => {},
          destroy: () => {},
        }
      }

      const hidePreNodeContainer = () => {
        preNodeContainer.style.visibility = 'hidden'
        preNodeContainer.dataset.pos = undefined
      }

      const preventDefault = (event: Event) => event.preventDefault()
      // Add mouse events to the handle
      const handleDragStart = (e: DragEvent) => startDrag(e, editorView)
      handleNode.addEventListener('dragstart', handleDragStart)
      handleNode.addEventListener('selectstart', preventDefault)

      const mousemove = (event: MouseEvent) => {
        if (!editor.isEditable) {
          hidePreNodeContainer()

          return false
        }
        const pos = editorView.posAtCoords({
          left: Math.max(
            event.clientX,
            editor.options.element.getBoundingClientRect().left -
              editorView.dom.offsetLeft +
              6
          ),
          top: event.clientY,
        })
        if (!pos || pos.inside === -1) {
          hidePreNodeContainer()

          return false
        }

        const hoveredNode = findBlockNodeAt(editorView.state, pos.pos)
        if (typeof hoveredNode === 'number') {
          const nodeDetail = editorView.state.doc.nodeAt(hoveredNode)!
          if (ignoreNode.has(nodeDetail.type.name)) {
            hidePreNodeContainer()

            return false
          }

          preNodeContainer.style.visibility = 'visible'
          const node = editorView.nodeDOM(hoveredNode)
          const rect = (node as HTMLDivElement).getBoundingClientRect()
          const editorRect = editorView.dom.getBoundingClientRect()
          const top = rect.top - editorRect.top
          let left = rect.left - editorRect.left + editorView.dom.offsetLeft
          if (nodeDetail.type.name === 'listItem') {
            // due to the current implementation of list item, the drag handle is not offset wrong
            // TODO: when fix the list item implementation, remove this
            left -= 22
          }
          preNodeContainer.style.top = `${top}px`
          preNodeContainer.style.left = `${left}px`
          preNodeContainer.dataset.pos = hoveredNode.toString()
        }

        return false
      }

      const mouseleave = (event: MouseEvent) => {
        const editorBound = editorView.dom.getBoundingClientRect()
        if (
          event.clientX < editorBound.left ||
          event.clientX > editorBound.right
        ) {
          hidePreNodeContainer()
        }

        return false
      }
      editorView.dom.addEventListener('mousemove', mousemove)
      editorView.dom.addEventListener('mouseleave', mouseleave)

      return {
        update: () => {},
        destroy: () => {
          handleNode.removeEventListener('dragstart', handleDragStart)
          editorView.dom.removeEventListener('mousemove', mousemove)
          editorView.dom.removeEventListener('mouseleave', mouseleave)
        },
      }
    },
  })
}

// Helper to update the plugin state
function updatePluginState(view: EditorView, pos: number | null): void {
  view.dispatch(view.state.tr.setMeta(dragHandlePluginKey, pos))
}

// Helper to get the plugin state
function getPluginState(state: EditorState): DragHandlePluginState {
  return dragHandlePluginKey.getState(state) as DragHandlePluginState
}

const parentToReturn = new Set(['listItem', 'taskItem'])

// Find a block node position at or near a given position
export function findBlockNodeAt(
  state: EditorState,
  pos: number
): number | null {
  const $pos = state.doc.resolve(pos)
  let depth = $pos.depth

  // Go up the tree to find the nearest block node
  while (depth > 0) {
    const node = $pos.node(depth)
    const parent = $pos.node(depth - 1)
    if (
      node.type.name === 'paragraph' &&
      parentToReturn.has(parent.type.name)
    ) {
      return $pos.before(depth - 1)
    }
    if (
      node.type.name === 'paragraph' &&
      parent.type.name === 'toggleSection' &&
      parent.firstChild === node
    ) {
      return $pos.before(depth - 1)
    }
    if (node.isBlock) {
      return $pos.before(depth)
    }
    depth--
  }

  // If we couldn't find a block node in the parent chain,
  // check if we're directly at a block node
  const nodeAtPos = state.doc.nodeAt(pos)
  if (nodeAtPos && nodeAtPos.isBlock) {
    return pos
  }

  return null
}

// Handler for starting a drag operation
function startDrag(event: DragEvent, view: EditorView): void {
  const handle = event.currentTarget as HTMLElement
  const handleContainer = handle.closest(
    '.pre-node-tool-container'
  ) as HTMLDivElement
  if (!handleContainer || !handleContainer.dataset.pos) return
  const nodePos = parseInt(handleContainer.dataset.pos)

  if (!view) return

  const node = view.state.doc.nodeAt(nodePos)
  if (!node) return

  const domNode = view.nodeDOM(nodePos)
  if (domNode) {
    event.dataTransfer?.setDragImage(domNode as HTMLElement, 0, 0)
  }

  // Change cursor style during drag
  handle.style.cursor = 'grabbing'

  // Store the original node for dragging
  const draggedNode: DraggedNodeInfo = {
    node,
    pos: nodePos,
    end: nodePos + node.nodeSize,
  }

  const endDrag = (endEvent: MouseEvent) => {
    handle.removeEventListener('dragend', endDrag)
    if (!view) return

    // Restore cursor style
    handle.style.cursor = 'grab'

    const pos = view.posAtCoords({
      left: endEvent.clientX,
      top: endEvent.clientY,
    })
    if (!pos) return

    const point = dropPoint(
      view.state.doc,
      pos.pos,
      view.state.doc.slice(nodePos, nodePos + node.nodeSize)
    )

    // Execute the node move
    moveNode(view, draggedNode, point ? point : pos.pos)
    view.dom.focus()
  }

  handle.addEventListener('dragend', endDrag)
}

// Execute the node move
function moveNode(
  view: EditorView,
  draggedNode: DraggedNodeInfo,
  targetPos: number
): void {
  const state = view.state
  let tr = state.tr

  // Delete the node from its original position
  tr = tr.deleteRange(draggedNode.pos, draggedNode.end)
  // Adjust target position if it would be shifted by the deletion
  const adjustedTargetPos = tr.mapping.map(targetPos)
  // Insert it at the target position
  tr = tr.insert(adjustedTargetPos, draggedNode.node)

  // Update selection position to draggedNode node
  const newSelection = TextSelection.create(tr.doc, adjustedTargetPos + 1)
  tr.setSelection(newSelection)

  // Apply the transaction
  view.dispatch(tr)
}
