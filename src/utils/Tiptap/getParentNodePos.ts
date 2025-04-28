import { NodePos } from '@tiptap/core'

export function getParentNode(nodePos: NodePos, parentDepth = 1) {
  if (nodePos.depth <= parentDepth) {
    return nodePos
  }

  return getParentNode(nodePos.parent!)
}
