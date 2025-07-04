import { createTwoslasher } from 'twoslash'

import { copyToClipboard } from './copyToClipboard.mjs'

const code = `
import { TextSelection, Transaction } from '@tiptap/pm/state'
// ---cut---
// import { TextSelection, Transaction } from '@tiptap/pm/state'
// Assuming that step 1&2 are already done
// by using \`posAtCoords\` like
// the example from Coordinate XY
// When listening to event 'dragstart' and 'dragend'
function moveNode(
  tr: Transaction,
  hoveredNodePos: number,
  dropPos: number
) {
  let newTr = tr
  // Get node info so we could calculate 
  // the start and end position
  const node = tr.doc.nodeAt(hoveredNodePos)
  if (!node) return

  const before = hoveredNodePos
  const after = hoveredNodePos + node.nodeSize

  // Step 3: Get the slice of the hovered node
  const slice = tr.doc.slice(before, after)

  // Step 4: Delete the hovered node from doc
  newTr = newTr.deleteRange(before, after)

  // Step 5.1: Map the drop position to the new transaction
  const updatedDropPos =
    newTr.mapping.map(dropPos)
  // Step 5.2: Insert the slice at the updated drop position
  newTr = newTr.insert(
    updatedDropPos,
    slice.content
  )

  // Step 6: Update selection position to draggedNode node
  const newSelection = TextSelection.create(
    newTr.doc,
    updatedDropPos + 1
  )
  newTr.setSelection(newSelection)

  // Extra Step 7: Apply the transaction
  // view.dispatch(newTr) -> if using view
  // return newTr -> or return the transaction state for further use
}
`

const twoslasher = createTwoslasher({})
const result = twoslasher(code)
const output = { hovers: result.hovers }

await copyToClipboard(JSON.stringify(output))
