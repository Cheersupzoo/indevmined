import { Plugin, PluginKey, EditorState, TextSelection } from '@tiptap/pm/state'
import { EditorView, Decoration, DecorationSet } from '@tiptap/pm/view'
import { Fragment, Node } from '@tiptap/pm/model'

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

// Create a new plugin for drag handles
export function dragHandlePlugin(): Plugin<DragHandlePluginState> {
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
          destroy: () => {}
        }
      }

      const preventDefault = (event: Event) => event.preventDefault()
      // Add mouse events to the handle
      const handleDragStart = (e: DragEvent) => startDrag(e, editorView)
      handleNode.addEventListener('dragstart', handleDragStart)
      handleNode.addEventListener('selectstart', preventDefault)

      const mousemove = (event: MouseEvent) => {
        const pos = editorView.posAtCoords({
          left: event.clientX,
          top: event.clientY
        })
        if (!pos) {
          preNodeContainer.style.visibility = 'hidden'

          return false
        }

        const hoveredNode = findBlockNodeAt(editorView.state, pos.pos)
        if (typeof hoveredNode === 'number') {
          preNodeContainer.style.visibility = 'visible'
          const node = editorView.nodeDOM(hoveredNode)
          const rect = (node as HTMLDivElement).getBoundingClientRect()
          const editorRect = editorView.dom.getBoundingClientRect()
          const top = rect.top - editorRect.top
          preNodeContainer.style.top = `${top}px`
        }

        return false
      }

      const mouseleave = (event: MouseEvent) => {
        const editorBound = editorView.dom.getBoundingClientRect()
        if (
          event.clientX < editorBound.left ||
          event.clientX > editorBound.right
        ) {
          preNodeContainer.style.visibility = 'hidden'
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
        }
      }
    }
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
  const handle = event.target as HTMLElement
  const pos = view.posAtCoords({
    left: event.clientX,
    top: event.clientY
  })
  if (!pos) {
    return
  }

  const nodePos = findBlockNodeAt(view.state, pos.pos)
  if (!view || typeof nodePos !== 'number') return

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
    end: nodePos + node.nodeSize
  }

  const endDrag = (endEvent: MouseEvent) => {
    handle.removeEventListener('dragend', endDrag)
    if (!view) return

    // Restore cursor style
    handle.style.cursor = 'grab'

    const pos = view.posAtCoords({
      left: endEvent.clientX,
      top: endEvent.clientY
    })
    if (!pos) return

    // Execute the node move
    moveNode(view, draggedNode, pos.pos)
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

  // Adjust target position if it would be shifted by the deletion
  const adjustedTargetPos =
    targetPos > draggedNode.pos
      ? targetPos - draggedNode.node.nodeSize
      : targetPos

  // Delete the node from its original position
  tr = tr.delete(draggedNode.pos, draggedNode.end)

  // Insert it at the target position
  tr = tr.insert(adjustedTargetPos, draggedNode.node)

  // Update selection position to draggedNode node
  const newSelection = TextSelection.create(tr.doc, adjustedTargetPos + 1)
  tr.setSelection(newSelection)

  // Apply the transaction
  view.dispatch(tr)
}
