import { mergeAttributes } from '@tiptap/core'

import { TestComponentBased } from './based'
import { TestComponentRenderer } from './component'

export default TestComponentBased.extend({
  group: 'block',

  draggable: true,

  content: 'block*',

  parseHTML() {
    return [
      {
        tag: 'react-component',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['react-component', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return TestComponentRenderer
  },
})
