import { Plugin, PluginKey, EditorState } from '@tiptap/pm/state'
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

    state: {
      init() {
        return { hoveredNode: null, showHandle: false, dragging: false }
      },
      apply(tr, state) {
        // Get the current position of the mouse from the transaction metadata
        const hoverPos = tr.getMeta(dragHandlePluginKey) as
          | number
          | null
          | undefined
        if (hoverPos !== undefined) {
          return { hoveredNode: hoverPos, showHandle: hoverPos !== null }
        }
        return state
      }
    },

    props: {
      // Add decorations to show handles
      decorations(state: EditorState): DecorationSet {
        const pluginState = this.getState(state)

        if (!pluginState?.showHandle || pluginState.hoveredNode === null) {
          return DecorationSet.empty
        }

        const pos = pluginState.hoveredNode
        const node = state.doc.nodeAt(pos)

        if (!node || !node.isBlock) return DecorationSet.empty

        // Create a widget decoration that will be placed before the block node
        const handleDecoration = Decoration.widget(
          pos,
          () => {
            const handle = document.createElement('div')
            handle.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-grip-vertical"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>'

            handle.style.cssText = `
            cursor: grab;
            position: absolute;
            left: -24px;
            color: #999;
            font-size: 16px;
            user-select: none;
            padding: 4px;
            `
            // Simple vertical dots as a drag handle
            handle.className = 'prosemirror-drag-handle'
            handle.setAttribute('data-drag-handle', 'true')
            handle.setAttribute('draggable', 'true')

            const preventDefault = (event: Event) => event.preventDefault()
            // Add mouse events to the handle
            handle.addEventListener('dragstart', (e: DragEvent) => startDrag(e))

            handle.addEventListener('selectstart', preventDefault)

            return handle
          },
          { side: -1 }
        ) // Place it to the left of the node

        return DecorationSet.create(state.doc, [handleDecoration])
      },

      // Track mouse movement to show/hide handles
      handleDOMEvents: {
        mousemove(view: EditorView, event: MouseEvent): boolean {
          const pos = view.posAtCoords({
            left: event.clientX,
            top: event.clientY
          })
          if (!pos) {
            updatePluginState(view, null)
            return false
          }

          const hoveredNode = findBlockNodeAt(view.state, pos.pos)
          if (hoveredNode !== getPluginState(view.state).hoveredNode) {
            updatePluginState(view, hoveredNode)
          }
          return false
        },
        mouseleave(view: EditorView): boolean {
          updatePluginState(view, null)
          return false
        }
      }
    },

    // View method to handle the drag operation
    view(editorView: EditorView) {
      setupDragHandles(editorView)
      return {
        update: () => {},
        destroy: () => {}
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
function findBlockNodeAt(state: EditorState, pos: number): number | null {
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

declare global {
  interface Window {
    _currentProseMirrorView?: EditorView
  }
}

// Handler for starting a drag operation
function startDrag(event: DragEvent): void {
  const handle = event.target as HTMLElement
  const view = window._currentProseMirrorView

  if (!view) return

  const state = view.state
  const pluginState = getPluginState(state)
  const nodePos = pluginState.hoveredNode

  if (nodePos === null) return

  const node = state.doc.nodeAt(nodePos)
  if (!node) return

  const domNode = view.nodeDOM(nodePos)
  let dragNode: HTMLDivElement
  if (domNode) {
    dragNode = document.createElement('div')
    dragNode.style.cssText = 'padding-left: 12px;'

    dragNode.appendChild(domNode.cloneNode(true))
    view.dom.parentNode?.appendChild(dragNode)
    event.dataTransfer?.setDragImage(dragNode, 0, 0)
  }

  // Change cursor style during drag
  handle.style.cursor = 'grabbing'
  document.body.style.cursor = 'grabbing'

  // Store the original node for dragging
  const draggedNode: DraggedNodeInfo = {
    node,
    pos: nodePos,
    end: nodePos + node.nodeSize
  }

  // Set up move and end handlers
  // const move = (moveEvent: MouseEvent) => {
  //   console.log('moving')

  //   const pos = view.posAtCoords({
  //     left: moveEvent.clientX,
  //     top: moveEvent.clientY
  //   })
  //   if (!pos) return
  // }

  const endDrag = (endEvent: MouseEvent) => {
    document.removeEventListener('dragend', endDrag)
    const handle = endEvent.target as HTMLElement
    const view = window._currentProseMirrorView

    if (!view) return

    if (dragNode) {
      view.dom.parentNode?.removeChild(dragNode)
    }

    // Restore cursor style
    document.body.style.cursor = ''
    handle.style.cursor = 'grab'

    const pos = view.posAtCoords({
      left: endEvent.clientX,
      top: endEvent.clientY
    })
    if (!pos) return

    // Execute the node move
    moveNode(view, draggedNode, pos.pos)
  }

  handle.addEventListener('dragend', endDrag)
}

// Find a valid position to drop the node
function findValidDropPosition(
  state: EditorState,
  targetPos: number,
  draggedNode: DraggedNodeInfo
): number {
  const $targetPos = state.doc.resolve(targetPos)

  // Don't allow dropping inside the dragged node itself
  if (targetPos > draggedNode.pos && targetPos < draggedNode.end) {
    if (targetPos > draggedNode.pos + draggedNode.node.nodeSize / 2) {
      return draggedNode.end
    } else {
      return draggedNode.pos
    }
  }

  // Find a valid depth where we can insert a block
  let depth = $targetPos.depth
  while (depth > 0) {
    const index = $targetPos.index(depth)
    const node = $targetPos.node(depth)

    // If we can insert the node at this depth, use this position
    if (
      node.canReplace(index, index, draggedNode.node as unknown as Fragment)
    ) {
      return $targetPos.before(depth + 1)
    }

    depth--
  }

  // If no good position found, default to current position
  return targetPos
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

  // Apply the transaction
  view.dispatch(tr)
}

// Example of how to add this plugin to an editor
export function setupDragHandles(view: EditorView): void {
  // Store the view globally for access in event handlers
  window._currentProseMirrorView = view

  // Add CSS styles for the editor
  const style = document.createElement('style')
  style.textContent = `
    
    .prosemirror-drag-handle {
      transition: opacity 0.3s;
    }
    
    .ProseMirror .prosemirror-drag-handle:hover {
      color: #07f;
    }
  `
  document.head.appendChild(style)
}
